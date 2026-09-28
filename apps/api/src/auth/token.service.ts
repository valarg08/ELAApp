import { createHash, randomBytes } from 'node:crypto';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ErrorCode, Role } from '@storyforge/shared';
import { SignJWT, jwtVerify } from 'jose';
import { AppError } from '../common/app-error.js';
import { ENV } from '../config/config.module.js';
import type { Env } from '../config/env.js';
import { DatabaseService } from '../database/database.service.js';
import type { AuthUser, IssuedSession } from './auth.types.js';

const ISSUER = 'storyforge-api';
const randomToken = () => randomBytes(32).toString('base64url');
const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');

const refreshInvalid = () =>
  new AppError(
    HttpStatus.UNAUTHORIZED,
    ErrorCode.REFRESH_INVALID,
    'Session expired',
    'Please log in again.',
  );

/**
 * Access tokens: short-lived HS256 JWTs.
 * Refresh tokens: random opaque strings stored as SHA-256 hashes, rotated on every use.
 * Presenting an already-used refresh token revokes its whole family (reuse detection, DESIGN.md §2.5).
 */
@Injectable()
export class TokenService {
  private readonly key: Uint8Array;

  constructor(
    @Inject(ENV) private readonly env: Env,
    private readonly db: DatabaseService,
  ) {
    this.key = new TextEncoder().encode(env.JWT_ACCESS_SECRET);
  }

  get accessTtlSeconds(): number {
    return this.env.ACCESS_TOKEN_TTL_MINUTES * 60;
  }

  get refreshTtlSeconds(): number {
    return this.env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60;
  }

  async signAccess(user: AuthUser): Promise<string> {
    return new SignJWT({ role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(user.id)
      .setIssuer(ISSUER)
      .setIssuedAt()
      .setExpirationTime(`${this.accessTtlSeconds}s`)
      .sign(this.key);
  }

  /** Returns the user for a valid access token, or null. */
  async verifyAccess(token: string): Promise<AuthUser | null> {
    try {
      const { payload } = await jwtVerify(token, this.key, {
        issuer: ISSUER,
        algorithms: ['HS256'],
      });
      const role = Role.safeParse(payload.role);
      return payload.sub && role.success ? { id: payload.sub, role: role.data } : null;
    } catch {
      return null;
    }
  }

  /** Start a new session (new refresh-token family). */
  async issueSession(user: AuthUser): Promise<IssuedSession> {
    return this.createSession(user, randomToken());
  }

  /** Rotate a refresh token. Throws REFRESH_INVALID if it is unknown, expired or reused. */
  async rotate(refreshToken: string): Promise<{ user: AuthUser; session: IssuedSession }> {
    const record = await this.db.client.refreshToken.findUnique({
      where: { tokenHash: sha256(refreshToken) },
    });
    if (!record) throw refreshInvalid();

    if (record.revokedAt) {
      // Reuse of a rotated token: assume theft and end every session in the family.
      await this.revokeFamily(record.familyId);
      throw refreshInvalid();
    }
    if (record.expiresAt <= new Date()) throw refreshInvalid();

    const user = await this.db.client.user.findUnique({ where: { id: record.userId } });
    if (!user || user.deletedAt || (user.lockedUntil && user.lockedUntil > new Date())) {
      await this.revokeFamily(record.familyId);
      throw refreshInvalid();
    }

    // Revoke the presented token only if nobody else rotated it at the same moment.
    const { count } = await this.db.client.refreshToken.updateMany({
      where: { id: record.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    if (count === 0) {
      await this.revokeFamily(record.familyId);
      throw refreshInvalid();
    }

    const authUser = { id: user.id, role: user.role };
    return { user: authUser, session: await this.createSession(authUser, record.familyId) };
  }

  /** End the session that owns this refresh token (logout). Unknown tokens are ignored. */
  async revokeByToken(refreshToken: string): Promise<void> {
    const record = await this.db.client.refreshToken.findUnique({
      where: { tokenHash: sha256(refreshToken) },
    });
    if (record) await this.revokeFamily(record.familyId);
  }

  /** End every session for a user (e.g. after a teacher resets a student's secret). */
  async revokeAllForUser(userId: string): Promise<void> {
    await this.db.client.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private async revokeFamily(familyId: string): Promise<void> {
    await this.db.client.refreshToken.updateMany({
      where: { familyId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private async createSession(user: AuthUser, familyId: string): Promise<IssuedSession> {
    const refreshToken = randomToken();
    await this.db.client.refreshToken.create({
      data: {
        userId: user.id,
        familyId,
        tokenHash: sha256(refreshToken),
        expiresAt: new Date(Date.now() + this.refreshTtlSeconds * 1000),
      },
    });
    return {
      accessToken: await this.signAccess(user),
      refreshToken,
      csrfToken: randomToken(),
    };
  }
}
