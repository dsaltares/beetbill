-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "vatNumber" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "website" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "postCode" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "iban" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "vatNumber" DROP NOT NULL,
ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "postCode" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "paymentTerms" SET DEFAULT 7;

-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "InvoiceProduct" ALTER COLUMN "quantity" SET DEFAULT 1,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "includesVat" SET DEFAULT false,
ALTER COLUMN "price" SET DEFAULT 0,
ALTER COLUMN "currency" SET DEFAULT 'EUR',
ALTER COLUMN "vat" SET DEFAULT 0,
ALTER COLUMN "unit" SET DEFAULT 'h';