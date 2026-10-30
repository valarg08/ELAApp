-- CreateTable
CREATE TABLE "SatAttempt" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "week" INTEGER NOT NULL,
    "state" JSONB NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),
    "correct" INTEGER,
    "total" INTEGER NOT NULL,

    CONSTRAINT "SatAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SatAttempt_studentId_week_key" ON "SatAttempt"("studentId", "week");

-- AddForeignKey
ALTER TABLE "SatAttempt" ADD CONSTRAINT "SatAttempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
