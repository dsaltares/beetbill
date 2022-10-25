import { z } from 'zod';

export const Company = z.object({
  id: z.string(),
  name: z.string(),
  number: z.string(),
  vatNumber: z.string().nullable(),
  email: z.string().nullable(),
  website: z.string().nullable(),
  country: z.string().nullable(),
  address: z.string().nullable(),
  postCode: z.string().nullable(),
  city: z.string().nullable(),
  iban: z.string().nullable(),
  userId: z.string(),
  createdAt: z.date(),
});

export const GetCompanyOutput = Company.nullish();
export const UpdateCompanyInput = Company.omit({
  createdAt: true,
  updatedAt: true,
  userId: true,
}).partial();
export const UpdateCompanyOutput = Company;

export type Company = z.infer<typeof Company>;
export type GetCompanyOutput = z.infer<typeof GetCompanyOutput>;
export type UpdateCompanyInput = z.infer<typeof UpdateCompanyInput>;
export type UpdateCompanyOutput = z.infer<typeof UpdateCompanyOutput>;
