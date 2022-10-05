import { z } from 'zod';

export const Company = z.object({
  id: z.string(),
  name: z.string(),
  number: z.string(),
  vatNumber: z.string(),
  email: z.string(),
  website: z.string(),
  country: z.string(),
  address: z.string(),
  postCode: z.string(),
  city: z.string(),
  iban: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetCompanyOutput = Company.nullish();
export const UpdateCompanyInput = Company.omit({
  createdAt: true,
  updatedAt: true,
}).partial();
export const UpdateCompanyOutput = Company;

export type Company = z.infer<typeof Company>;
export type GetCompanyOutput = z.infer<typeof GetCompanyOutput>;
export type UpdateCompanyInput = z.infer<typeof UpdateCompanyInput>;
export type UpdateCompanyOutput = z.infer<typeof UpdateCompanyOutput>;
