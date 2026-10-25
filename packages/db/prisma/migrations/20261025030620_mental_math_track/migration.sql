-- AlterEnum
ALTER TYPE "Track" ADD VALUE 'MENTAL';

-- AlterTable
ALTER TABLE "Unit" ADD COLUMN     "tips" JSONB NOT NULL DEFAULT '[]';
