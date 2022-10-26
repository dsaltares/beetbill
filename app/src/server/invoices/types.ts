import { z } from 'zod';
import { Client } from '@server/clients/types';
import { Company } from '@server/company/types';
import { LineItem } from '@server/lineItems/types';

export const InvoiceStatus = z.enum(['DRAFT', 'SENT', 'PAID']);
export const Invoice = z.object({
  id: z.string(),
  status: InvoiceStatus,
  prefix: z.string(),
  number: z.number(),
  date: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  company: Company,
  client: Client,
  items: LineItem.array(),
});

export const GetInvoiceInput = z.object({
  id: z.string(),
});
export const GetInvoiceOutput = Invoice;
export const GetInvoicesInput = z.object({}).nullish();
export const GetInvoicesOutput = Invoice.array();
export const CreateInvoiceInput = z.object({
  status: InvoiceStatus.optional(),
  prefix: z.string().optional(),
  number: z.number().optional(),
  date: z.date().optional(),
  clientId: z.string(),
});
export const CreateInvoiceOutput = Invoice;
export const DeleteInvoiceInput = z.object({ id: z.string() });
export const DeleteInvoiceOutput = z.string();
export const UpdateInvoiceInput = z.object({
  id: z.string(),
  status: InvoiceStatus.optional(),
  prefix: z.string().optional(),
  number: z.number().optional(),
  date: z.date().optional(),
  companyId: z.string().optional(),
  clientId: z.string().optional(),
});
export const UpdateInvoiceOutput = Invoice;

export type Invoice = z.infer<typeof Invoice>;
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
