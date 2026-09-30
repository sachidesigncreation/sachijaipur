-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "gemstoneCount" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "StonePrice" ADD COLUMN     "satinCost" DOUBLE PRECISION NOT NULL DEFAULT 0;
