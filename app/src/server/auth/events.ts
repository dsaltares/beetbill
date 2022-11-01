import type { EventCallbacks } from 'next-auth';
import prisma from '@server/prisma';

const createUser: EventCallbacks['createUser'] = async ({ user }) => {
  await prisma.company.create({
    data: {
      userId: user.id,
      states: {
        create: {
          name: '',
          number: '',
          vatNumber: '',
          email: '',
          website: '',
          country: '',
          address: '',
          postCode: '',
          city: '',
          iban: '',
        },
      },
    },
  });
};

const events = {
  createUser,
};

export default events;
