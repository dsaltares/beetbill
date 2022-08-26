/*
  Warnings:

  - A unique constraint covering the columns `[invoiceId,productId]` on the table `InvoiceProduct` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "InvoiceProduct_invoiceId_productId_key" ON "InvoiceProduct"("invoiceId", "productId");
