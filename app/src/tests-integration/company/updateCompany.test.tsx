import type { Company, User } from '@prisma/client';
import prisma from '@server/prisma';
import { updateCompany } from '@server/company/updateCompany';
import { TRPCError } from '@trpc/server';

let user: User;
let company: Company;

describe('updateCompany', () => {
  beforeEach(async () => {
    user = await prisma.user.create({ data: {} });
    company = await prisma.company.create({
      data: {
        name: 'company',
        number: '123',
        vatNumber: '123',
        email: 'test@company.com',
        website: 'company.com',
        country: 'Romania',
        address: 'street',
        city: 'Cluj-Napoca',
        postCode: '123',
        iban: 'RO123',
        userId: user.id,
      },
    });
  });

  it('returns updated company', async () => {
    const newName = 'new company name';
    const result = await updateCompany({
      ctx: { session: { userId: user.id, companyId: company.id, expires: '' } },
      input: {
        name: newName,
      },
    });
    const dbCompany = await prisma.company.findUnique({
      where: { id: company.id },
    });
    expect(result.name).toEqual(newName);
    expect(result).toEqual(dbCompany);
  });

  it('throws when the company does not exist', async () => {
    const newName = 'new company name';
    await expect(
      updateCompany({
        ctx: {
          session: {
            userId: user.id,
            companyId: 'invalid_company',
            expires: '',
          },
        },
        input: {
          name: newName,
        },
      })
    ).rejects.toEqual(new TRPCError({ code: 'NOT_FOUND' }));
  });
});
