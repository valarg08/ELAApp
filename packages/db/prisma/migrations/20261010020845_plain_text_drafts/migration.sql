-- AlterTable
ALTER TABLE "DraftVersion" ALTER COLUMN "contentJson" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Submission" ALTER COLUMN "contentJson" DROP NOT NULL;
