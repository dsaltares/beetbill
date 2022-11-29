import type { Invoice } from '@server/invoices/types';
import type { Product } from '@server/products/types';

export type LineItemFormValue = {
  product: Product;
  date: string;
  quantity: string;
};

export type InvoiceFormValues = {
  status: Invoice['status'];
  prefix: Invoice['prefix'];
  date: string;
  message: string;
  client: Invoice['client'];
  items: LineItemFormValue[];
};
