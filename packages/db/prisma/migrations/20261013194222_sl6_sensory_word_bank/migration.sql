-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ActivityType" ADD VALUE 'SENSORY_SCENE';
ALTER TYPE "ActivityType" ADD VALUE 'PERSONIFICATION_SCENE';
ALTER TYPE "ActivityType" ADD VALUE 'SENSORY_CHALLENGE';

-- CreateTable
CREATE TABLE "SensoryWord" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "sense" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SensoryWord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SensoryWord_studentId_idx" ON "SensoryWord"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "SensoryWord_studentId_sense_word_key" ON "SensoryWord"("studentId", "sense", "word");

-- AddForeignKey
ALTER TABLE "SensoryWord" ADD CONSTRAINT "SensoryWord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
