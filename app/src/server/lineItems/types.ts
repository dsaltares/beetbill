import { z } from 'zod';
import { Product } from '@server/products/types';

export const LineItem = z.object({
  id: z.string(),
  invoiceId: z.string(),
  quantity: z.number(),
  date: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  product: Product,
});
