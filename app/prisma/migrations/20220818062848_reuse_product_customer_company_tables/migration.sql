/*
  Warnings:

  - You are about to drop the column `paymentTerms` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `InvoiceProduct` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `InvoiceProduct` table. All the data in the column will be lost.
  - You are about to drop the column `includesVat` on the `InvoiceProduct` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `InvoiceProduct` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `InvoiceProduct` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `InvoiceProduct` table. All the data in the column will be lost.
  - You are about to drop the column `vat` on the `InvoiceProduct` table. All the data in the column will be lost.
  - You are about to drop the `InvoiceCompany` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InvoiceCustomer` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[companyId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customerId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customerId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `InvoiceProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `InvoiceProduct` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InvoiceCompany" DROP CONSTRAINT "InvoiceCompany_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "InvoiceCustomer" DROP CONSTRAINT "InvoiceCustomer_invoiceId_fkey";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "originalId" TEXT;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "originalId" TEXT;

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "paymentTerms",
ADD COLUMN     "customerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "InvoiceProduct" DROP COLUMN "currency",
DROP COLUMN "deletedAt",
DROP COLUMN "includesVat",
DROP COLUMN "name",
DROP COLUMN "price",
DROP COLUMN "unit",
DROP COLUMN "vat",
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "originalId" TEXT;

-- DropTable
DROP TABLE "InvoiceCompany";

-- DropTable
DROP TABLE "InvoiceCustomer";

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_companyId_key" ON "Invoice"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_customerId_key" ON "Invoice"("customerId");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_originalId_fkey" FOREIGN KEY ("originalId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_originalId_fkey" FOREIGN KEY ("originalId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_originalId_fkey" FOREIGN KEY ("originalId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceProduct" ADD CONSTRAINT "InvoiceProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
