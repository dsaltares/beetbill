/*
  Warnings:

  - You are about to drop the column `invoiceId` on the `Client` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_clientStateId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_companyStateId_fkey";

-- DropIndex
DROP INDEX "Invoice_clientStateId_key";

-- DropIndex
DROP INDEX "Invoice_companyStateId_key";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "invoiceId";

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_companyStateId_fkey" FOREIGN KEY ("companyStateId") REFERENCES "CompanyState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_clientStateId_fkey" FOREIGN KEY ("clientStateId") REFERENCES "ClientState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
