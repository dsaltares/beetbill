import type { Company, User } from '@prisma/client';
import type { Session } from 'next-auth';
import cuid from 'cuid';
import omit from 'lodash.omit';
import prisma from '@server/prisma';
import { createTestCompany, createTestUser } from '../testData';
import { createClient } from '@server/clients/createClient';

let user: User;
let company: Company;
let session: Session;

describe('createClient', () => {
  beforeEach(async () => {
    user = await createTestUser();
    company = await createTestCompany(user.id);
    session = { userId: user.id, companyId: company.id, expires: '' };
  });

  it('creates a client for the company in the session', async () => {
    const input = {
      name: 'Test Client',
      number: cuid(),
    };
    const result = await createClient({
      ctx: { session },
      input,
    });
    const dbClient = await prisma.client.findUniqueOrThrow({
      where: { id: result.id },
      include: { states: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });
    expect(result).toMatchObject(input);
    expect(result).toMatchObject(omit(dbClient.states[0], 'id', 'createdAt'));
  });

  it('throws when the company does not exist', async () => {
    await expect(
      createClient({
        ctx: { session: { ...session, companyId: 'invalid_company' } },
        input: {
          name: 'Test Client',
          number: cuid(),
        },
      })
    ).rejects.toThrow();
  });
});
