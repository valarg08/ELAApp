import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { AddWordsRequest, type WordBankResponse } from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { CurrentUser, Roles } from '../auth/decorators.js';
import { WordBankService } from './word-bank.service.js';

/** The student's own sensory word bank (Unit 6). Students only see and change their own words. */
@Controller('word-bank')
export class WordBankController {
  constructor(private readonly wordBank: WordBankService) {}

  @Roles('STUDENT')
  @Get()
  list(@CurrentUser() user: AuthUser): Promise<WordBankResponse> {
    return this.wordBank.list(user);
  }

  @Roles('STUDENT')
  @Post()
  @HttpCode(200)
  add(
    @CurrentUser() user: AuthUser,
    @Body({ schema: AddWordsRequest }) body: AddWordsRequest,
  ): Promise<WordBankResponse> {
    return this.wordBank.add(user, body);
  }

  @Roles('STUDENT')
  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string): Promise<WordBankResponse> {
    return this.wordBank.remove(user, id);
  }
}
