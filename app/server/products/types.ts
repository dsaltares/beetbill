import { z } from 'zod';

export const Product = z.object({
  id: z.string(),
  name: z.string(),
  includesVat: z.boolean(),
  price: z.number(),
  currency: z.string(),
  vat: z.number(),
  unit: z.string(),
  companyId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export const GetProductsOutput = Product.array();
export const CreateProductsInput = Product.omit({
  id: true,
  companyId: true,
  createdAt: true,
  updatedAt: true,
});
export const CreateProductOutput = Product;
export const DeleteProductsInput = z.object({ id: z.string() });
export const DeleteProductOutput = z.string();
export const UpdateProductsInput = Product.omit({
  companyId: true,
  createdAt: true,
  updatedAt: true,
});
export const UpdateProductOutput = Product;

export type Product = z.infer<typeof Product>;
export type GetProductsOutput = z.infer<typeof GetProductsOutput>;
export type CreateProductsInput = z.infer<typeof CreateProductsInput>;
export type CreateProductOutput = z.infer<typeof CreateProductOutput>;
export type DeleteProductsInput = z.infer<typeof DeleteProductsInput>;
export type DeleteProductOutput = z.infer<typeof DeleteProductOutput>;
export type UpdateProductsInput = z.infer<typeof UpdateProductsInput>;
export type UpdateProductOutput = z.infer<typeof UpdateProductOutput>;
