-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ActivityType" ADD VALUE 'PROBLEMS';
ALTER TYPE "ActivityType" ADD VALUE 'PROBLEM_SET';

-- AlterEnum
ALTER TYPE "Track" ADD VALUE 'MATH';

-- CreateTable
CREATE TABLE "MathErrorLog" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "activityKey" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "wrongTimes" INTEGER NOT NULL DEFAULT 1,
    "correctRedos" INTEGER NOT NULL DEFAULT 0,
    "lastRedoAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MathErrorLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MathErrorLog_studentId_resolvedAt_idx" ON "MathErrorLog"("studentId", "resolvedAt");

-- CreateIndex
CREATE UNIQUE INDEX "MathErrorLog_studentId_activityKey_problemId_key" ON "MathErrorLog"("studentId", "activityKey", "problemId");

-- AddForeignKey
ALTER TABLE "MathErrorLog" ADD CONSTRAINT "MathErrorLog_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
