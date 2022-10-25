import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { CreateClientOutput, CreateClientInput } from './types';

export const createClient: Procedure<CreateClientInput, CreateClientOutput> = ({
  ctx: { session },
  input,
}) =>
  prisma.client.create({
    data: { companyId: session?.companyId as string, ...input },
  });

export default procedure
  .input(CreateClientInput)
  .output(CreateClientOutput)
  .mutation(createClient);
