-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'sale';

-- CreateIndex
CREATE INDEX "Property_category_idx" ON "Property"("category");
