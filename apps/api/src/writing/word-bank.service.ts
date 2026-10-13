import { HttpStatus, Injectable } from '@nestjs/common';
import { localSafetyFlags } from '@storyforge/ai';
import {
  type AddWordsRequest,
  ErrorCode,
  SenseName,
  WORD_BANK_LIMIT,
  type WordBankResponse,
} from '@storyforge/shared';
import type { AuthUser } from '../auth/auth.types.js';
import { AppError, notFound } from '../common/app-error.js';
import { DatabaseService } from '../database/database.service.js';

const SENSE_ORDER = ['sight', 'sound', 'smell', 'taste', 'touch'];

/** The student's personal sensory word bank (DESIGN.md §9.10). */
@Injectable()
export class WordBankService {
  constructor(private readonly db: DatabaseService) {}

  async list(user: AuthUser): Promise<WordBankResponse> {
    const rows = await this.db.client.sensoryWord.findMany({
      where: { studentId: user.id },
      orderBy: { createdAt: 'asc' },
    });
    const words = rows
      .flatMap((r) => {
        const sense = SenseName.safeParse(r.sense);
        return sense.success ? [{ id: r.id, sense: sense.data, word: r.word }] : [];
      })
      .toSorted((a, b) => SENSE_ORDER.indexOf(a.sense) - SENSE_ORDER.indexOf(b.sense));
    return { words, limit: WORD_BANK_LIMIT, skipped: 0 };
  }

  /** Add words (duplicates are ignored; words the safety check flags are skipped). */
  async add(user: AuthUser, { entries }: AddWordsRequest): Promise<WordBankResponse> {
    const fresh = new Map<string, { sense: string; word: string }>();
    let skipped = 0;
    for (const e of entries) {
      const word = e.word.replaceAll('’', "'");
      if (localSafetyFlags(word).length > 0) {
        skipped += 1;
        continue;
      }
      fresh.set(`${e.sense}|${word}`, { sense: e.sense, word });
    }
    const existing = await this.db.client.sensoryWord.count({ where: { studentId: user.id } });
    if (existing + fresh.size > WORD_BANK_LIMIT) {
      throw new AppError(
        HttpStatus.UNPROCESSABLE_ENTITY,
        ErrorCode.VALIDATION_FAILED,
        'Word bank full',
        `Your word bank can hold ${WORD_BANK_LIMIT} words. Remove a few you don’t use, then try again.`,
      );
    }
    if (fresh.size > 0) {
      await this.db.client.sensoryWord.createMany({
        data: [...fresh.values()].map((w) => ({ ...w, studentId: user.id })),
        skipDuplicates: true,
      });
    }
    return { ...(await this.list(user)), skipped };
  }

  async remove(user: AuthUser, id: string): Promise<WordBankResponse> {
    const { count } = await this.db.client.sensoryWord.deleteMany({
      where: { id, studentId: user.id },
    });
    if (count === 0) throw notFound(ErrorCode.NOT_FOUND, 'That word isn’t in your word bank.');
    return this.list(user);
  }
}
