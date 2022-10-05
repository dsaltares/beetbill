import type { Company, User } from '@prisma/client';
import prisma from '@server/prisma';
import { getCompany } from '@server/company/getCompany';

let user: User;
let company: Company;

describe('getCompany', () => {
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

  it('returns null when the company does not exist', async () => {
    const result = await getCompany({
      ctx: {
        session: {
          userId: 'invalid_user',
          companyId: 'invalid_company',
          expires: '',
        },
      },
      input: {},
    });
    expect(result).toBeNull();
  });

  it('returns the company for the user in the session', async () => {
    const result = await getCompany({
      ctx: {
        session: {
          userId: user.id,
          companyId: company.id,
          expires: '',
        },
      },
      input: {},
    });
    expect(result).toEqual(company);
  });
});
