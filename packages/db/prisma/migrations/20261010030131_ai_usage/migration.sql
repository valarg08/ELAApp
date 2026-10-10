-- CreateTable
CREATE TABLE "AiUsage" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "analyzer" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "userId" TEXT,
    "classId" TEXT,
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,
    "cacheReadTokens" INTEGER NOT NULL DEFAULT 0,
    "latencyMs" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiUsage_userId_kind_createdAt_idx" ON "AiUsage"("userId", "kind", "createdAt");

-- CreateIndex
CREATE INDEX "AiUsage_classId_kind_createdAt_idx" ON "AiUsage"("classId", "kind", "createdAt");
