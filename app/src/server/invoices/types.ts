import { z } from 'zod';
import { Client } from '@server/clients/types';
import { Company } from '@server/company/types';
import { Product } from '@server/products/types';

export const LineItem = z.object({
  id: z.string(),
  invoiceId: z.string(),
  quantity: z.number(),
  date: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  product: Product,
});
export const InvoiceStatus = z.enum(['DRAFT', 'SENT', 'PAID']);
export const Invoice = z.object({
  id: z.string(),
  status: InvoiceStatus,
  prefix: z.string(),
  number: z.number().nullish(),
  date: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  company: Company,
  client: Client,
  items: LineItem.array(),
});

export const LineItemsInput = z.array(
  z.object({
    productId: z.string(),
    quantity: z.number().optional(),
    date: z.string().optional(),
  })
);

export const GetInvoiceInput = z.object({
  id: z.string(),
});
export const GetInvoiceOutput = Invoice;
export const GetInvoicesInput = z.object({}).nullish();
export const GetInvoicesOutput = Invoice.array();
export const CreateInvoiceInput = z.object({
  status: InvoiceStatus.optional(),
  prefix: z.string().optional(),
  date: z.string().optional(),
  clientId: z.string(),
  items: LineItemsInput.optional(),
});
export const CreateInvoiceOutput = Invoice;
export const DeleteInvoiceInput = z.object({ id: z.string() });
export const DeleteInvoiceOutput = z.string();
export const UpdateInvoiceInput = z.object({
  id: z.string(),
  status: InvoiceStatus.optional(),
  prefix: z.string().optional(),
  date: z.string().optional(),
  clientId: z.string().optional(),
  items: LineItemsInput.optional(),
});
export const UpdateInvoiceOutput = Invoice;

export type InvoiceStatus = z.infer<typeof InvoiceStatus>;
export type Invoice = z.infer<typeof Invoice>;
export type LineItemsInput = z.infer<typeof LineItemsInput>;
export type GetInvoiceInput = z.infer<typeof GetInvoiceInput>;
export type GetInvoiceOutput = z.infer<typeof GetInvoiceOutput>;
export type GetInvoicesInput = z.infer<typeof GetInvoicesInput>;
export type GetInvoicesOutput = z.infer<typeof GetInvoicesOutput>;
export type CreateInvoiceInput = z.infer<typeof CreateInvoiceInput>;
export type CreateInvoiceOutput = z.infer<typeof CreateInvoiceOutput>;
export type DeleteInvoiceInput = z.infer<typeof DeleteInvoiceInput>;
export type DeleteInvoiceOutput = z.infer<typeof DeleteInvoiceOutput>;
export type UpdateInvoiceInput = z.infer<typeof UpdateInvoiceInput>;
export type UpdateInvoiceOutput = z.infer<typeof UpdateInvoiceOutput>;
