import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  APP_NAME,
  ErrorCode,
  type LoginCardsRequest,
  StudentSecretKind,
  describeSecret,
} from '@storyforge/shared';
import PdfKit from 'pdfkit';
import QRCode from 'qrcode';
import type { AuthUser } from '../auth/auth.types.js';
import { PasswordService } from '../auth/password.service.js';
import { AppError, notFound } from '../common/app-error.js';
import { ENV } from '../config/config.module.js';
import type { Env } from '../config/env.js';
import { DatabaseService } from '../database/database.service.js';
import { ClassAccessService } from './class-access.service.js';

// A4 in points; 2 columns × 4 rows of cards.
const PAGE = { width: 595.28, height: 841.89, margin: 36 };
const COLS = 2;
const ROWS = 4;

interface Card {
  displayName: string;
  username: string;
  secretKind: StudentSecretKind;
  secret: string;
}

/**
 * Printable login cards. Secrets are never stored in plain text, so the client sends back the
 * secrets it was just shown; each one is verified against the stored hash before it is printed.
 */
@Injectable()
export class LoginCardsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly access: ClassAccessService,
    private readonly passwords: PasswordService,
    @Inject(ENV) private readonly env: Env,
  ) {}

  async render(teacher: AuthUser, classId: string, input: LoginCardsRequest): Promise<Buffer> {
    const klass = await this.access.ownedClass(teacher, classId);
    const ids = input.cards.map((c) => c.studentId);
    const students = await this.db.client.user.findMany({
      where: {
        id: { in: ids },
        role: 'STUDENT',
        deletedAt: null,
        enrollments: { some: { classId } },
      },
    });
    const byId = new Map(students.map((s) => [s.id, s]));

    const cards: Card[] = [];
    for (const { studentId, secret } of input.cards) {
      const student = byId.get(studentId);
      if (!student?.studentSecretHash) {
        throw notFound(ErrorCode.STUDENT_NOT_FOUND, 'A student on this list is not in the class.');
      }
      if (!(await this.passwords.verify(student.studentSecretHash, secret))) {
        throw new AppError(
          HttpStatus.UNPROCESSABLE_ENTITY,
          ErrorCode.SECRET_MISMATCH,
          'Password out of date',
          `The password for ${student.displayName} has changed. Reset it to print a new card.`,
        );
      }
      cards.push({
        displayName: student.displayName,
        username: student.username,
        secretKind: StudentSecretKind.catch('PICTURE').parse(student.studentSecretKind),
        secret,
      });
    }
    return this.pdf(klass.name, klass.joinCode, cards);
  }

  private async pdf(className: string, joinCode: string, cards: Card[]): Promise<Buffer> {
    const doc = new PdfKit({
      size: 'A4',
      margin: PAGE.margin,
      info: { Title: `${className} login cards` },
    });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    const done = new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
    });

    const cardW = (PAGE.width - PAGE.margin * 2) / COLS;
    const cardH = (PAGE.height - PAGE.margin * 2) / ROWS;

    for (const [i, card] of cards.entries()) {
      const slot = i % (COLS * ROWS);
      if (i > 0 && slot === 0) doc.addPage();
      const x = PAGE.margin + (slot % COLS) * cardW;
      const y = PAGE.margin + Math.floor(slot / COLS) * cardH;
      await this.drawCard(doc, card, className, joinCode, x, y, cardW, cardH);
    }

    doc.end();
    return done;
  }

  private async drawCard(
    doc: PDFKit.PDFDocument,
    card: Card,
    className: string,
    joinCode: string,
    x: number,
    y: number,
    w: number,
    h: number,
  ): Promise<void> {
    const pad = 12;
    const qrSize = 86;
    // Dashed cut lines around each card.
    doc
      .save()
      .dash(4, { space: 4 })
      .lineWidth(0.5)
      .strokeColor('#9ca3af')
      .rect(x, y, w, h)
      .stroke()
      .restore();

    const joinUrl = `${this.env.WEB_ORIGIN}/join?code=${joinCode}&user=${encodeURIComponent(card.username)}`;
    const qr = await QRCode.toBuffer(joinUrl, { margin: 1, width: qrSize * 3 });
    doc.image(qr, x + w - pad - qrSize, y + pad, { width: qrSize });

    const textW = w - pad * 3 - qrSize;
    doc
      .fillColor('#2e5aac')
      .font('Helvetica-Bold')
      .fontSize(9)
      .text(`${APP_NAME} · ${className}`, x + pad, y + pad, { width: textW });
    doc
      .fillColor('#111827')
      .font('Helvetica-Bold')
      .fontSize(18)
      .text(card.displayName, x + pad, y + pad + 16, { width: textW });

    let ty = y + pad + 46;
    const line = (label: string, value: string, size = 11) => {
      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor('#6b7280')
        .text(label.toUpperCase(), x + pad, ty, { width: textW });
      doc
        .font('Helvetica-Bold')
        .fontSize(size)
        .fillColor('#111827')
        .text(value, x + pad, ty + 10, { width: textW });
      ty += 12 + size + 8;
    };
    line('Class code', joinCode, 14);
    line('Username', card.username);

    const secretLabel =
      card.secretKind === 'PICTURE'
        ? 'Your picture password (tap in this order)'
        : 'Your secret code';
    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor('#6b7280')
      .text(secretLabel.toUpperCase(), x + pad, ty, { width: w - pad * 2 });
    doc
      .font('Helvetica-Bold')
      .fontSize(14)
      .fillColor('#111827')
      .text(describeSecret(card.secretKind, card.secret), x + pad, ty + 11, { width: w - pad * 2 });

    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor('#6b7280')
      .text(
        'Scan the code or go to the StoryForge website and choose "I\'m a student". Keep this card private.',
        x + pad,
        y + h - pad - 20,
        { width: w - pad * 2 },
      );
  }
}
