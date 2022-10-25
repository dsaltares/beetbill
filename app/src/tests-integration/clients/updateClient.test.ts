import type { User } from '@prisma/client';
import type { Session } from 'next-auth';
import { TRPCError } from '@trpc/server';
import { updateClient } from '@server/clients/updateClients';
import {
  createTestCompany,
  createTestClient,
  createTestUser,
} from '../testData';
import prisma from '@server/prisma';
import omit from 'lodash.omit';

let user: User;
let company: Awaited<ReturnType<typeof createTestCompany>>;
let session: Session;

describe('updateClient', () => {
  beforeEach(async () => {
    user = await createTestUser();
    company = await createTestCompany(user.id);
    session = { userId: user.id, companyId: company.id, expires: '' };
  });

  it('throws when trying to update a non existing client', async () => {
    await expect(
      updateClient({
        ctx: { session },
        input: {
          id: 'invalid_client',
          name: 'Test Client',
        },
      })
    ).rejects.toEqual(new TRPCError({ code: 'NOT_FOUND' }));
  });

  it('throws when trying to update an invoice client of a non draft invoice', async () => {
    const client = await createTestClient(company.id);
    await prisma.invoice.create({
      data: {
        number: 1,
        status: 'SENT',
        clientStateId: client.states[0].id,
        companyStateId: company.states[0].id,
      },
    });
    await expect(
      updateClient({
        ctx: { session },
        input: {
          id: client.id,
          name: 'Test Client',
        },
      })
    ).rejects.toThrowError();
  });

  it('updates the client', async () => {
    const client = await createTestClient(company.id);
    const newName = 'Updated Client';
    const updatedClient = await updateClient({
      ctx: { session },
      input: {
        id: client.id,
        name: newName,
      },
    });
    const dbClient = await prisma.client.findUniqueOrThrow({
      where: { id: client.id },
      include: {
        states: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    expect(updatedClient.name).toEqual(newName);
    expect(updatedClient).toMatchObject(
      omit(dbClient.states[0], 'id', 'createdAt')
    );
  });
});
