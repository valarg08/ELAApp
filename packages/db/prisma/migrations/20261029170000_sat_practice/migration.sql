-- CreateTable
CREATE TABLE "SatPracticeSession" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "state" JSONB NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "SatPracticeSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SatPracticeSession_studentId_startedAt_idx" ON "SatPracticeSession"("studentId", "startedAt");

-- AddForeignKey
ALTER TABLE "SatPracticeSession" ADD CONSTRAINT "SatPracticeSession_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
