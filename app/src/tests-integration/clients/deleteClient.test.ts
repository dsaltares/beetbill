import type { User } from '@prisma/client';
import type { Session } from 'next-auth';
import { TRPCError } from '@trpc/server';
import prisma from '@server/prisma';
import {
  createTestCompany,
  createTestUser,
  createTestClient,
} from '../testData';
import { deleteClient } from '@server/clients/deleteClient';

let user: User;
let company: Awaited<ReturnType<typeof createTestCompany>>;
let session: Session;
let client: Awaited<ReturnType<typeof createTestClient>>;

describe('deleteClient', () => {
  beforeEach(async () => {
    user = await createTestUser();
    company = await createTestCompany(user.id);
    client = await createTestClient(company.id);
    session = { userId: user.id, companyId: company.id, expires: '' };
  });

  it('does nothing when the client does not exist', async () => {
    const clientDoesNotExistId = 'invalid_client';
    const id = await deleteClient({
      ctx: { session },
      input: { id: clientDoesNotExistId },
    });
    expect(id).toEqual(clientDoesNotExistId);
  });

  it('throws when the client has a non draft invoice', async () => {
    await prisma.invoice.create({
      data: {
        number: 1,
        status: 'SENT',
        clientStateId: client.states[0].id,
        companyStateId: company.states[0].id,
      },
    });

    await expect(
      deleteClient({ ctx: { session }, input: { id: client.id } })
    ).rejects.toEqual(
      new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'Client is associated to approved invoices',
      })
    );
  });

  it('soft deletes the client', async () => {
    await prisma.invoice.create({
      data: {
        number: 1,
        status: 'DRAFT',
        clientStateId: client.states[0].id,
        companyStateId: company.states[0].id,
      },
    });

    const id = await deleteClient({
      ctx: { session },
      input: { id: client.id },
    });
    const dbClient = await prisma.client.findUnique({
      where: { id: client.id },
    });
    expect(id).toEqual(client.id);
    expect(dbClient?.deletedAt).not.toEqual(null);
  });
});
