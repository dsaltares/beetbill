import type { User } from '@prisma/client';
import omit from 'lodash.omit';
import { getCompany } from '@server/company/getCompany';
import { createTestCompany, createTestUser } from '../testData';

let user: User;
let company: Awaited<ReturnType<typeof createTestCompany>>;

describe('getCompany', () => {
  beforeEach(async () => {
    user = await createTestUser();
    company = await createTestCompany(user.id);
  });

  it('throws when the company does not exist', async () => {
    await expect(
      getCompany({
        ctx: {
          session: {
            userId: 'invalid_user',
            companyId: 'invalid_company',
            expires: '',
          },
        },
        input: {},
      })
    ).rejects.toThrow();
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
    expect(result).toMatchObject(omit(company.states[0], 'id', 'createdAt'));
  });
});
