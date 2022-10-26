import 'tsconfig-paths/register';
import prisma from '@server/prisma';

const setup = async () => {
  await prisma.invoice.deleteMany();

  await Promise.all([
    prisma.account.deleteMany(),
    prisma.user.deleteMany(),
    prisma.session.deleteMany(),
    prisma.verificationToken.deleteMany(),
    prisma.company.deleteMany(),
    prisma.product.deleteMany(),
    prisma.client.deleteMany(),
  ]);
};

export default setup;
