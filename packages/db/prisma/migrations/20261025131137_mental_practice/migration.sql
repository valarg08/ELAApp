-- CreateTable
CREATE TABLE "MentalStart" (
    "studentId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "startUnit" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MentalStart_pkey" PRIMARY KEY ("studentId")
);

-- AddForeignKey
ALTER TABLE "MentalStart" ADD CONSTRAINT "MentalStart_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
