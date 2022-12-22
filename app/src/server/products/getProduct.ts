import { TRPCError } from '@trpc/server';
import { NotFoundError } from '@prisma/client/runtime';
import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { GetProductInput, GetProductOutput } from './types';
import mapProductEntity from './mapProductEntity';

export const getProduct: Procedure<GetProductInput, GetProductOutput> = async ({
  ctx: { session },
  input: { id },
}) => {
  try {
    const product = await prisma.product.findFirstOrThrow({
      where: { id, companyId: session?.companyId, deletedAt: null },
      include: {
        states: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    return mapProductEntity(product);
  } catch (e) {
    if (e instanceof NotFoundError) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'The product does not exist.',
      });
    }
    throw e;
  }
};

export default procedure
  .input(GetProductInput)
  .output(GetProductOutput)
  .query(getProduct);
