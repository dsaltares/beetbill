import type { CallbacksOptions } from 'next-auth';
import prisma from '@server/prisma';

const session: CallbacksOptions['session'] = async ({ session, user }) => {
  const company = await prisma.company.findUnique({
    where: { userId: user.id },
  });
  session.userId = user.id;
  session.companyId = company?.id as string;
  return session;
};

const callbacks = {
  session,
};

export default callbacks;
