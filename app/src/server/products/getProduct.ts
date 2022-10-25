import { TRPCError } from '@trpc/server';
import { NotFoundError } from '@prisma/client/runtime';
import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { GetProductInput, GetProductOutput } from './types';

export const getProduct: Procedure<GetProductInput, GetProductOutput> = async ({
  ctx: { session },
  input: { id },
}) => {
  try {
    const product = await prisma.product.findFirstOrThrow({
      where: { id, companyId: session?.companyId, deletedAt: null },
    });
    return product;
  } catch (e) {
    if (e instanceof NotFoundError) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }
    throw e;
  }
};

export default procedure
  .input(GetProductInput)
  .output(GetProductOutput)
  .query(getProduct);
