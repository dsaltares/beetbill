import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { CreateClientOutput, CreateClientInput } from './types';
import mapClientEntity from './mapClientEntity';

export const createClient: Procedure<
  CreateClientInput,
  CreateClientOutput
> = async ({ ctx: { session }, input }) => {
  const client = await prisma.client.create({
    data: {
      companyId: session?.companyId as string,
      states: { create: input },
    },
    include: { states: true },
  });
  return mapClientEntity(client);
};

export default procedure
  .input(CreateClientInput)
  .output(CreateClientOutput)
  .mutation(createClient);
