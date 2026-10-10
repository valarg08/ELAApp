-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ActivityType" ADD VALUE 'CHARACTER_SKETCH';
ALTER TYPE "ActivityType" ADD VALUE 'TRAITS_IN_ACTION';
ALTER TYPE "ActivityType" ADD VALUE 'CHARACTER_VOICE';
ALTER TYPE "ActivityType" ADD VALUE 'FLAW_SCENE';

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "choices" JSONB;
