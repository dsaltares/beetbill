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
export const GetProductInput = z.object({
  id: z.string(),
});
export const GetProductOutput = Product;
export const GetProductsOutput = Product.array();
export const CreateProductInput = Product.omit({
  id: true,
  companyId: true,
  createdAt: true,
  updatedAt: true,
});
export const CreateProductOutput = Product;
export const DeleteProductInput = z.object({ id: z.string() });
export const DeleteProductOutput = z.string();
export const UpdateProductInput = Product.omit({
  companyId: true,
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .merge(z.object({ id: z.string() }));
export const UpdateProductOutput = Product;

export type Product = z.infer<typeof Product>;
export type GetProductInput = z.infer<typeof GetProductInput>;
export type GetProductOutput = z.infer<typeof GetProductOutput>;
export type GetProductsOutput = z.infer<typeof GetProductsOutput>;
export type CreateProductInput = z.infer<typeof CreateProductInput>;
export type CreateProductOutput = z.infer<typeof CreateProductOutput>;
export type DeleteProductInput = z.infer<typeof DeleteProductInput>;
export type DeleteProductOutput = z.infer<typeof DeleteProductOutput>;
export type UpdateProductInput = z.infer<typeof UpdateProductInput>;
export type UpdateProductOutput = z.infer<typeof UpdateProductOutput>;
