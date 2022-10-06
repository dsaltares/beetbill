import type { Company, User } from '@prisma/client';
import { getCompany } from '@server/company/getCompany';
import { createTestCompany, createTestUser } from '../testData';

let user: User;
let company: Company;

describe('getCompany', () => {
  beforeEach(async () => {
    user = await createTestUser();
    company = await createTestCompany(user.id);
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
