-- AlterTable
ALTER TABLE "MathErrorLog" ADD COLUMN     "seed" INTEGER;

-- CreateTable
CREATE TABLE "MathContent" (
    "key" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "contentHash" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MathContent_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "MathAnswerLog" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "lessonId" TEXT,
    "activityKey" TEXT,
    "problemId" TEXT NOT NULL,
    "seed" INTEGER,
    "skill" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "verdict" TEXT NOT NULL,
    "hintsUsed" INTEGER NOT NULL DEFAULT 0,
    "seconds" INTEGER,
    "confidence" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MathAnswerLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MathSkillState" (
    "studentId" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "box" INTEGER NOT NULL DEFAULT 1,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MathSkillState_pkey" PRIMARY KEY ("studentId","skill")
);

-- CreateTable
CREATE TABLE "MathTestAttempt" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "testKey" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "answers" JSONB NOT NULL,
    "timeLimitSeconds" INTEGER,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),
    "correct" INTEGER,
    "points" DOUBLE PRECISION,
    "total" INTEGER NOT NULL,

    CONSTRAINT "MathTestAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MathAnswerLog_studentId_skill_createdAt_idx" ON "MathAnswerLog"("studentId", "skill", "createdAt");

-- CreateIndex
CREATE INDEX "MathAnswerLog_studentId_createdAt_idx" ON "MathAnswerLog"("studentId", "createdAt");

-- CreateIndex
CREATE INDEX "MathSkillState_studentId_dueAt_idx" ON "MathSkillState"("studentId", "dueAt");

-- CreateIndex
CREATE INDEX "MathTestAttempt_studentId_kind_startedAt_idx" ON "MathTestAttempt"("studentId", "kind", "startedAt");

-- AddForeignKey
ALTER TABLE "MathAnswerLog" ADD CONSTRAINT "MathAnswerLog_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MathSkillState" ADD CONSTRAINT "MathSkillState_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MathTestAttempt" ADD CONSTRAINT "MathTestAttempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
