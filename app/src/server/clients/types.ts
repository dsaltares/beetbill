import { z } from 'zod';

export const Amount = z.object({
  value: z.number(),
  currency: z.string(),
});

export const Client = z.object({
  id: z.string(),
  name: z.string(),
  number: z.string(),
  vatNumber: z.string().nullable(),
  contactName: z.string().nullable(),
  email: z.string().nullable(),
  country: z.string().nullable(),
  address: z.string().nullable(),
  postCode: z.string().nullable(),
  city: z.string().nullable(),
  paymentTerms: z.number(),
  companyId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  toBePaid: Amount.optional(),
  paid: Amount.optional(),
});

export const GetClientInput = z.object({
  id: z.string(),
});
export const GetClientOutput = Client;
export const GetClientsOutput = Client.array();
export const CreateClientInput = Client.omit({
  id: true,
  companyId: true,
  createdAt: true,
  updatedAt: true,
  toBePaid: true,
  paid: true,
}).partial({
  vatNumber: true,
  contactName: true,
  email: true,
  country: true,
  address: true,
  postCode: true,
  city: true,
  paymentTerms: true,
});
export const CreateClientOutput = Client;
export const DeleteClientInput = z.object({ id: z.string() });
export const DeleteClientOutput = z.string();
export const UpdateClientInput = Client.omit({
  companyId: true,
  createdAt: true,
  updatedAt: true,
  toBePaid: true,
  paid: true,
})
  .partial()
  .merge(z.object({ id: z.string() }));
export const UpdateClientOutput = Client;

export type Amount = z.infer<typeof Amount>;
export type Client = z.infer<typeof Client>;
export type GetClientInput = z.infer<typeof GetClientInput>;
export type GetClientOutput = z.infer<typeof GetClientOutput>;
export type GetClientsOutput = z.infer<typeof GetClientsOutput>;
export type CreateClientInput = z.infer<typeof CreateClientInput>;
export type CreateClientOutput = z.infer<typeof CreateClientOutput>;
export type DeleteClientInput = z.infer<typeof DeleteClientInput>;
export type DeleteClientOutput = z.infer<typeof DeleteClientOutput>;
export type UpdateClientInput = z.infer<typeof UpdateClientInput>;
export type UpdateClientOutput = z.infer<typeof UpdateClientOutput>;
