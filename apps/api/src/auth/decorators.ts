import { type ExecutionContext, SetMetadata, createParamDecorator } from '@nestjs/common';
import type { Role } from '@storyforge/shared';
import { unauthenticated } from '../common/app-error.js';
import type { AuthUser, AuthedRequest } from './auth.types.js';

export const IS_PUBLIC = 'storyforge:isPublic';
export const ROLES = 'storyforge:roles';

/** Route needs no login (and is exempt from the CSRF check). */
export const Public = () => SetMetadata(IS_PUBLIC, true);

/** Route is limited to these roles. */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES, roles);

/** The logged-in user. Only valid on non-public routes. */
export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext): AuthUser => {
  const user = ctx.switchToHttp().getRequest<AuthedRequest>().user;
  if (!user) throw unauthenticated();
  return user;
});
