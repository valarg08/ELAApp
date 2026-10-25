import { Controller, Get, Param } from '@nestjs/common';
import { ErrorCode, type FactSheetView, type MentalHome } from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { CurrentUser, Roles } from '../auth/decorators.js';
import { notFound } from '../common/app-error.js';
import { MentalService } from './mental.service.js';

@Controller('mental')
export class MentalController {
  constructor(private readonly mental: MentalService) {}

  @Roles('STUDENT')
  @Get('home')
  home(@CurrentUser() user: AuthUser): Promise<MentalHome> {
    return this.mental.home(user);
  }

  @Get('cheat-sheets/:unitNumber')
  cheatSheet(
    @CurrentUser() user: AuthUser,
    @Param('unitNumber') unitNumber: string,
  ): Promise<FactSheetView> {
    const n = Number(unitNumber);
    if (!Number.isInteger(n) || n < 1 || n > 15) throw notFound(ErrorCode.NOT_FOUND, 'Not found.');
    return this.mental.cheatSheet(user, n);
  }
}
