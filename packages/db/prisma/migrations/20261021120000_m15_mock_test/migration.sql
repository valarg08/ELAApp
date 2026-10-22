-- M15: Unit 15 mocks run as MOCK_TEST activities on the timed test engine.
ALTER TYPE "ActivityType" ADD VALUE 'MOCK_TEST';

-- M15: the past-paper log (answer letters and topic tags only, never problem text).
CREATE TABLE "MathPastPaper" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "takenOn" TIMESTAMP(3) NOT NULL,
    "items" JSONB NOT NULL,
    "correct" INTEGER NOT NULL,
    "blank" INTEGER NOT NULL,
    "points" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MathPastPaper_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MathPastPaper_studentId_takenOn_idx" ON "MathPastPaper"("studentId", "takenOn");

-- AddForeignKey
ALTER TABLE "MathPastPaper" ADD CONSTRAINT "MathPastPaper_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
