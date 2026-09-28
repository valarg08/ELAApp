import { Injectable } from '@nestjs/common';
import { hash, verify } from '@node-rs/argon2';

/** Argon2id (the library default) with OWASP's minimum recommended cost: 19 MiB, 2 passes. */
const OPTIONS = { memoryCost: 19_456, timeCost: 2, parallelism: 1 } as const;

@Injectable()
export class PasswordService {
  private dummyHash: Promise<string> | null = null;

  hash(plain: string): Promise<string> {
    return hash(plain, OPTIONS);
  }

  async verify(storedHash: string, plain: string): Promise<boolean> {
    try {
      return await verify(storedHash, plain);
    } catch {
      return false;
    }
  }

  /**
   * Verify against a throwaway hash when the account doesn't exist, so a failed login
   * takes the same time whether or not the username/email is real.
   */
  async verifyDummy(plain: string): Promise<false> {
    this.dummyHash ??= this.hash('storyforge-dummy-password');
    await this.verify(await this.dummyHash, plain);
    return false;
  }
}
