-- CreateEnum
CREATE TYPE "UpdateType" AS ENUM ('PRICING', 'CAMPAIGN', 'RELEASE', 'PARTNERSHIP', 'FEATURE', 'ANNOUNCEMENT', 'OTHER');

-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "competitorUpdateId" TEXT;

-- CreateTable
CREATE TABLE "Competitor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "industry" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Competitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitorUpdate" (
    "id" TEXT NOT NULL,
    "competitorId" TEXT NOT NULL,
    "type" "UpdateType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "sourceChannel" "Channel" NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "impact" "AlertSeverity" NOT NULL DEFAULT 'MEDIUM',
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompetitorUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Competitor_name_key" ON "Competitor"("name");

-- CreateIndex
CREATE INDEX "CompetitorUpdate_competitorId_idx" ON "CompetitorUpdate"("competitorId");

-- CreateIndex
CREATE INDEX "CompetitorUpdate_type_idx" ON "CompetitorUpdate"("type");

-- CreateIndex
CREATE INDEX "CompetitorUpdate_publishedAt_idx" ON "CompetitorUpdate"("publishedAt");

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_competitorUpdateId_fkey" FOREIGN KEY ("competitorUpdateId") REFERENCES "CompetitorUpdate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitorUpdate" ADD CONSTRAINT "CompetitorUpdate_competitorId_fkey" FOREIGN KEY ("competitorId") REFERENCES "Competitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
