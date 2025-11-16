-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('PDF', 'DOCX', 'DOC', 'TXT', 'MARKDOWN', 'HTML', 'IMAGE', 'SPREADSHEET', 'PRESENTATION', 'VIDEO', 'AUDIO', 'OTHER');

-- CreateEnum
CREATE TYPE "DocumentCategoryType" AS ENUM ('TOPIC', 'PROJECT', 'TEAM', 'DEPARTMENT', 'GENERAL');

-- CreateTable
CREATE TABLE "DocumentCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DocumentCategoryType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "fileType" "DocumentType" NOT NULL,
    "fileUrl" TEXT,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "author" TEXT,
    "team" TEXT,
    "project" TEXT,
    "tags" TEXT[],
    "indexedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentCategoryRelation" (
    "documentId" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "DocumentCategoryRelation_pkey" PRIMARY KEY ("documentId","categoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "DocumentCategory_name_key" ON "DocumentCategory"("name");

-- CreateIndex
CREATE INDEX "Document_title_idx" ON "Document"("title");

-- CreateIndex
CREATE INDEX "Document_team_idx" ON "Document"("team");

-- CreateIndex
CREATE INDEX "Document_project_idx" ON "Document"("project");

-- CreateIndex
CREATE INDEX "Document_fileType_idx" ON "Document"("fileType");

-- CreateIndex
CREATE INDEX "Document_indexedAt_idx" ON "Document"("indexedAt");

-- AddForeignKey
ALTER TABLE "DocumentCategoryRelation" ADD CONSTRAINT "DocumentCategoryRelation_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentCategoryRelation" ADD CONSTRAINT "DocumentCategoryRelation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "DocumentCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
