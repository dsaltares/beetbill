import type { User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import omit from 'lodash.omit';
import prisma from '@server/prisma';
import { updateCompany } from '@server/company/updateCompany';
import { createTestCompany, createTestUser } from '../testData';

let user: User;
let company: Awaited<ReturnType<typeof createTestCompany>>;

describe('updateCompany', () => {
  beforeEach(async () => {
    user = await createTestUser();
    company = await createTestCompany(user.id);
  });

  it('returns updated company', async () => {
    const newName = 'new company name';
    const result = await updateCompany({
      ctx: { session: { userId: user.id, companyId: company.id, expires: '' } },
      input: {
        name: newName,
      },
    });
    const dbCompany = await prisma.company.findUniqueOrThrow({
      where: { id: company.id },
      include: {
        states: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    expect(result.name).toEqual(newName);
    expect(result).toMatchObject(omit(dbCompany.states[0], 'id', 'createdAt'));
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
    ).rejects.toEqual(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'The company does not exist.',
      })
    );
  });
});
