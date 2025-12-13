-- CreateTable
CREATE TABLE "invitation_codes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "shareUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNUSED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "usedBy" TEXT,
    "usedAt" DATETIME,
    "metadata" JSONB
);

-- CreateIndex
CREATE UNIQUE INDEX "invitation_codes_code_key" ON "invitation_codes"("code");
