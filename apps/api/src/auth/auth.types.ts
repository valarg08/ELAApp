import type { Role } from '@storyforge/shared';
import type { Request } from 'express';

/** The logged-in user, as known from the access token. */
export interface AuthUser {
  id: string;
  role: Role;
}

export interface AuthedRequest extends Request {
  user?: AuthUser;
}

/** Tokens and CSRF value produced by a successful login or refresh. */
export interface IssuedSession {
  accessToken: string;
  refreshToken: string;
  csrfToken: string;
}
