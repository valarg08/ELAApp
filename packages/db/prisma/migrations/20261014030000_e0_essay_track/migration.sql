-- CreateEnum
CREATE TYPE "Track" AS ENUM ('STORY', 'ESSAY');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ActivityType" ADD VALUE 'QUIZ';
ALTER TYPE "ActivityType" ADD VALUE 'TRANSFORM';

-- DropIndex
DROP INDEX "Unit_number_key";

-- AlterTable
ALTER TABLE "Unit" ADD COLUMN     "track" "Track" NOT NULL DEFAULT 'STORY';

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "activityKey" TEXT NOT NULL,
    "questionIds" JSONB NOT NULL,
    "answers" JSONB,
    "score" INTEGER,
    "total" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuizAttempt_studentId_lessonId_activityKey_idx" ON "QuizAttempt"("studentId", "lessonId", "activityKey");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_track_number_key" ON "Unit"("track", "number");

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

