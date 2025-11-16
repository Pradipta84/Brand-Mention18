-- CreateEnum
CREATE TYPE "QueryChannel" AS ENUM ('EMAIL', 'TWITTER', 'REDDIT', 'CHAT', 'FORUM', 'SUPPORT_TICKET', 'OTHER');

-- CreateEnum
CREATE TYPE "QueryTagType" AS ENUM ('QUESTION', 'REQUEST', 'COMPLAINT', 'FEEDBACK', 'BUG_REPORT', 'FEATURE_REQUEST', 'BILLING', 'TECHNICAL', 'GENERAL');

-- CreateEnum
CREATE TYPE "QueryPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "QueryStatus" AS ENUM ('NEW', 'ASSIGNED', 'IN_PROGRESS', 'WAITING_CUSTOMER', 'RESOLVED', 'CLOSED');

-- CreateTable
CREATE TABLE "QueryTag" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "type" "QueryTagType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QueryTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Query" (
    "id" TEXT NOT NULL,
    "channel" "QueryChannel" NOT NULL,
    "sourceId" TEXT,
    "authorName" TEXT NOT NULL,
    "authorEmail" TEXT,
    "authorHandle" TEXT,
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "priority" "QueryPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "QueryStatus" NOT NULL DEFAULT 'NEW',
    "sourceUrl" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstResponseAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Query_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueryTagRelation" (
    "queryId" TEXT NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "QueryTagRelation_pkey" PRIMARY KEY ("queryId","tagId")
);

-- CreateTable
CREATE TABLE "QueryAssignment" (
    "id" TEXT NOT NULL,
    "queryId" TEXT NOT NULL,
    "assigneeId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "QueryAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueryHistory" (
    "id" TEXT NOT NULL,
    "queryId" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QueryHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QueryTag_label_key" ON "QueryTag"("label");

-- CreateIndex
CREATE INDEX "Query_status_idx" ON "Query"("status");

-- CreateIndex
CREATE INDEX "Query_priority_idx" ON "Query"("priority");

-- CreateIndex
CREATE INDEX "Query_channel_idx" ON "Query"("channel");

-- CreateIndex
CREATE INDEX "Query_receivedAt_idx" ON "Query"("receivedAt");

-- CreateIndex
CREATE INDEX "Query_sourceId_idx" ON "Query"("sourceId");

-- CreateIndex
CREATE INDEX "QueryAssignment_queryId_idx" ON "QueryAssignment"("queryId");

-- CreateIndex
CREATE INDEX "QueryAssignment_assigneeId_idx" ON "QueryAssignment"("assigneeId");

-- CreateIndex
CREATE INDEX "QueryHistory_queryId_idx" ON "QueryHistory"("queryId");

-- CreateIndex
CREATE INDEX "QueryHistory_createdAt_idx" ON "QueryHistory"("createdAt");

-- AddForeignKey
ALTER TABLE "QueryTagRelation" ADD CONSTRAINT "QueryTagRelation_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "Query"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueryTagRelation" ADD CONSTRAINT "QueryTagRelation_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "QueryTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueryAssignment" ADD CONSTRAINT "QueryAssignment_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "Query"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueryAssignment" ADD CONSTRAINT "QueryAssignment_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueryHistory" ADD CONSTRAINT "QueryHistory_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "Query"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueryHistory" ADD CONSTRAINT "QueryHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
