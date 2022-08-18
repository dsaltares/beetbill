/*
  Warnings:

  - A unique constraint covering the columns `[prefix,number,companyId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Invoice_prefix_number_companyId_key" ON "Invoice"("prefix", "number", "companyId");
