-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "sku" TEXT,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "baseMetal" TEXT NOT NULL,
    "purityOptions" TEXT[],
    "metalColorOptions" TEXT[],
    "availableStones" TEXT[],
    "primaryGemstone" TEXT,
    "images" TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "weightGrams" DOUBLE PRECISION,
    "makingChargeC" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientAccount" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phone" TEXT,
    "businessType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "rejectionNote" TEXT,
    "approvalToken" TEXT,
    "supabaseUid" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "phone" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuingBody" TEXT NOT NULL,
    "imageKey" TEXT NOT NULL,
    "validity" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StonePrice" (
    "id" TEXT NOT NULL,
    "stoneName" TEXT NOT NULL,
    "priceD" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "StonePrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "ClientAccount_email_key" ON "ClientAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ClientAccount_approvalToken_key" ON "ClientAccount"("approvalToken");

-- CreateIndex
CREATE UNIQUE INDEX "ClientAccount_supabaseUid_key" ON "ClientAccount"("supabaseUid");

-- CreateIndex
CREATE UNIQUE INDEX "StonePrice_stoneName_key" ON "StonePrice"("stoneName");
