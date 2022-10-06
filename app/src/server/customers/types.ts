import { z } from 'zod';

export const Customer = z.object({
  id: z.string(),
  name: z.string(),
  number: z.string(),
  vatNumber: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string().nullable(),
  country: z.string().nullable(),
  address: z.string().nullable(),
  postCode: z.string().nullable(),
  city: z.string().nullable(),
  paymentTerms: z.number(),
  companyId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetCustomersOutput = Customer.array();
export const CreateCustomerInput = Customer.omit({
  id: true,
  companyId: true,
  createdAt: true,
  updatedAt: true,
}).partial({
  vatNumber: true,
  firstName: true,
  lastName: true,
  email: true,
  country: true,
  address: true,
  postCode: true,
  city: true,
  paymentTerms: true,
});
export const CreateCustomerOutput = Customer;
export const DeleteCustomerInput = z.object({ id: z.string() });
export const DeleteCustomerOutput = z.string();
export const UpdateCustomerInput = Customer.omit({
  companyId: true,
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .merge(z.object({ id: z.string() }));
export const UpdateCustomerOutput = Customer;

export type Customer = z.infer<typeof Customer>;
export type GetCustomersOutput = z.infer<typeof GetCustomersOutput>;
export type CreateCustomerInput = z.infer<typeof CreateCustomerInput>;
export type CreateCustomerOutput = z.infer<typeof CreateCustomerOutput>;
export type DeleteCustomerInput = z.infer<typeof DeleteCustomerInput>;
export type DeleteCustomerOutput = z.infer<typeof DeleteCustomerOutput>;
export type UpdateCustomerInput = z.infer<typeof UpdateCustomerInput>;
export type UpdateCustomerOutput = z.infer<typeof UpdateCustomerOutput>;
