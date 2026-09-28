import { timingSafeEqual } from 'node:crypto';
import { type CanActivate, type ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ACCESS_COOKIE, CSRF_COOKIE, CSRF_HEADER, ErrorCode, type Role } from '@storyforge/shared';
import { AppError, forbidden, unauthenticated } from '../common/app-error.js';
import type { AuthedRequest } from './auth.types.js';
import { IS_PUBLIC, ROLES } from './decorators.js';
import { TokenService } from './token.service.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function isPublic(reflector: Reflector, ctx: ExecutionContext): boolean {
  return (
    reflector.getAllAndOverride<boolean>(IS_PUBLIC, [ctx.getHandler(), ctx.getClass()]) ?? false
  );
}

/** Global guard 1: every route needs a valid access-token cookie unless marked @Public(). */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokens: TokenService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    if (isPublic(this.reflector, ctx)) return true;
    const req = ctx.switchToHttp().getRequest<AuthedRequest>();
    const token: unknown = req.cookies?.[ACCESS_COOKIE];
    const user = typeof token === 'string' ? await this.tokens.verifyAccess(token) : null;
    if (!user) throw unauthenticated();
    req.user = user;
    return true;
  }
}

/** Global guard 2: state-changing requests must echo the CSRF cookie in a header (double submit). */
@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<AuthedRequest>();
    if (SAFE_METHODS.has(req.method) || isPublic(this.reflector, ctx)) return true;
    const cookie: unknown = req.cookies?.[CSRF_COOKIE];
    const header = req.get(CSRF_HEADER);
    if (typeof cookie === 'string' && header && safeEqual(cookie, header)) return true;
    throw new AppError(
      HttpStatus.FORBIDDEN,
      ErrorCode.CSRF_FAILED,
      'Security check failed',
      'Refresh the page and try again.',
    );
  }
}

/** Global guard 3: enforce @Roles(...) when present. */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[] | undefined>(ROLES, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!roles || roles.length === 0) return true;
    const user = ctx.switchToHttp().getRequest<AuthedRequest>().user;
    if (!user) throw unauthenticated();
    if (!roles.includes(user.role)) throw forbidden();
    return true;
  }
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}
