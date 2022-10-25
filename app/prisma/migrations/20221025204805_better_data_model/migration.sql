/*
  Warnings:

  - You are about to drop the column `address` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `originalId` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `paymentTerms` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `postCode` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `vatNumber` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `iban` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `originalId` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `postCode` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `vatNumber` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `includesVat` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `originalId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `vat` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `InvoiceProduct` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[companyStateId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clientStateId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[prefix,number,companyStateId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clientStateId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyStateId` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_originalId_fkey";

-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_originalId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_companyId_fkey";

-- DropForeignKey
ALTER TABLE "InvoiceProduct" DROP CONSTRAINT "InvoiceProduct_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "InvoiceProduct" DROP CONSTRAINT "InvoiceProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_originalId_fkey";

-- DropIndex
DROP INDEX "Invoice_clientId_key";

-- DropIndex
DROP INDEX "Invoice_companyId_key";

-- DropIndex
DROP INDEX "Invoice_prefix_number_companyId_key";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "email",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "name",
DROP COLUMN "number",
DROP COLUMN "originalId",
DROP COLUMN "paymentTerms",
DROP COLUMN "postCode",
DROP COLUMN "vatNumber",
ADD COLUMN     "invoiceId" TEXT;

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "email",
DROP COLUMN "iban",
DROP COLUMN "name",
DROP COLUMN "number",
DROP COLUMN "originalId",
DROP COLUMN "postCode",
DROP COLUMN "updatedAt",
DROP COLUMN "vatNumber",
DROP COLUMN "website",
ADD COLUMN     "invoiceId" TEXT;

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "clientId",
DROP COLUMN "companyId",
ADD COLUMN     "clientStateId" TEXT NOT NULL,
ADD COLUMN     "companyStateId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "currency",
DROP COLUMN "includesVat",
DROP COLUMN "name",
DROP COLUMN "originalId",
DROP COLUMN "price",
DROP COLUMN "unit",
DROP COLUMN "vat";

-- DropTable
DROP TABLE "InvoiceProduct";

-- CreateTable
CREATE TABLE "CompanyState" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "vatNumber" TEXT,
    "email" TEXT,
    "website" TEXT,
    "country" TEXT,
    "address" TEXT,
    "postCode" TEXT,
    "city" TEXT,
    "iban" TEXT,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductState" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "includesVat" BOOLEAN NOT NULL DEFAULT false,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "vat" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL DEFAULT 'h',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" TEXT NOT NULL,

    CONSTRAINT "ProductState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientState" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "vatNumber" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "country" TEXT,
    "address" TEXT,
    "postCode" TEXT,
    "city" TEXT,
    "paymentTerms" INTEGER NOT NULL DEFAULT 7,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "ClientState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LineItem" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "productStateId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LineItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_companyStateId_key" ON "Invoice"("companyStateId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_clientStateId_key" ON "Invoice"("clientStateId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_prefix_number_companyStateId_key" ON "Invoice"("prefix", "number", "companyStateId");

-- AddForeignKey
ALTER TABLE "CompanyState" ADD CONSTRAINT "CompanyState_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductState" ADD CONSTRAINT "ProductState_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientState" ADD CONSTRAINT "ClientState_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_companyStateId_fkey" FOREIGN KEY ("companyStateId") REFERENCES "CompanyState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_clientStateId_fkey" FOREIGN KEY ("clientStateId") REFERENCES "ClientState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_productStateId_fkey" FOREIGN KEY ("productStateId") REFERENCES "ProductState"("id") ON DELETE CASCADE ON UPDATE CASCADE;
