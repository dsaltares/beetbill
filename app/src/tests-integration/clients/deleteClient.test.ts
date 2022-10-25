import type { Company, Client, User } from '@prisma/client';
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
let company: Company;
let session: Session;
let client: Client;

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
    const invoiceClient = await prisma.client.create({
      data: {
        companyId: company.id,
        name: client.name,
        number: client.number,
        originalId: client.id,
      },
    });
    await prisma.invoice.create({
      data: {
        number: 1,
        clientId: invoiceClient.id,
        companyId: company.id,
        status: 'SENT',
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

  it('throws when the client has a non draft invoice and deleting the invoice one', async () => {
    const invoiceClient = await prisma.client.create({
      data: {
        companyId: company.id,
        name: client.name,
        number: client.number,
        originalId: client.id,
      },
    });
    await prisma.invoice.create({
      data: {
        number: 1,
        clientId: invoiceClient.id,
        companyId: company.id,
        status: 'SENT',
      },
    });

    await expect(
      deleteClient({ ctx: { session }, input: { id: invoiceClient.id } })
    ).rejects.toEqual(
      new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'Client is associated to approved invoices',
      })
    );
  });

  it('soft deletes the client', async () => {
    const invoiceClient = await prisma.client.create({
      data: {
        companyId: company.id,
        name: client.name,
        number: client.number,
        originalId: client.id,
      },
    });
    await prisma.invoice.create({
      data: {
        number: 1,
        clientId: invoiceClient.id,
        companyId: company.id,
        status: 'DRAFT',
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
