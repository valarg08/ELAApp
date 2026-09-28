import { Body, Controller, Get, HttpCode, Inject, Post, Req, Res } from '@nestjs/common';
import {
  LoginRequest,
  type MeResponse,
  REFRESH_COOKIE,
  RegisterTeacherRequest,
  StudentLoginRequest,
  StudentLookupRequest,
  type StudentLookupResponse,
} from '@storyforge/shared';
import type { Request, Response } from 'express';
import { ENV } from '../config/config.module.js';
import type { Env } from '../config/env.js';
import { clearSessionCookies, setSessionCookies } from './auth.cookies.js';
import { AuthService, type LoginResult } from './auth.service.js';
import type { AuthUser } from './auth.types.js';
import { CurrentUser, Public } from './decorators.js';
import { TokenService } from './token.service.js';

interface SessionBody {
  user: AuthUser;
}

@Controller('auth')
export class AuthController {
  private readonly secureCookies: boolean;

  constructor(
    private readonly auth: AuthService,
    private readonly tokens: TokenService,
    @Inject(ENV) env: Env,
  ) {
    this.secureCookies = env.NODE_ENV === 'production';
  }

  @Public()
  @Post('register')
  async register(
    @Body({ schema: RegisterTeacherRequest }) body: RegisterTeacherRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SessionBody> {
    return this.startSession(res, await this.auth.registerTeacher(body));
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(
    @Body({ schema: LoginRequest }) body: LoginRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SessionBody> {
    return this.startSession(res, await this.auth.loginTeacher(body));
  }

  @Public()
  @Post('student/lookup')
  @HttpCode(200)
  lookup(
    @Body({ schema: StudentLookupRequest }) body: StudentLookupRequest,
  ): Promise<StudentLookupResponse> {
    return this.auth.lookupClass(body.joinCode);
  }

  @Public()
  @Post('student/login')
  @HttpCode(200)
  async studentLogin(
    @Body({ schema: StudentLoginRequest }) body: StudentLoginRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SessionBody> {
    return this.startSession(res, await this.auth.loginStudent(body));
  }

  /** Public: the access token may have expired. The refresh cookie is the credential. */
  @Public()
  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SessionBody> {
    try {
      return this.startSession(res, await this.auth.refresh(refreshCookie(req)));
    } catch (error) {
      clearSessionCookies(res, this.secureCookies);
      throw error;
    }
  }

  @Public()
  @Post('logout')
  @HttpCode(204)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    await this.auth.logout(refreshCookie(req));
    clearSessionCookies(res, this.secureCookies);
  }

  @Get('me')
  me(@CurrentUser() user: AuthUser): Promise<MeResponse> {
    return this.auth.me(user);
  }

  private startSession(res: Response, result: LoginResult): SessionBody {
    setSessionCookies(res, result.session, {
      secure: this.secureCookies,
      accessTtlSeconds: this.tokens.accessTtlSeconds,
      refreshTtlSeconds: this.tokens.refreshTtlSeconds,
    });
    return { user: result.user };
  }
}

function refreshCookie(req: Request): string | undefined {
  const value: unknown = req.cookies?.[REFRESH_COOKIE];
  return typeof value === 'string' ? value : undefined;
}
