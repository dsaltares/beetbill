import type { Session } from 'next-auth';
import capitalizeFirstLetter from './capitalizeFirstLetter';

export const getFullName = (user: NonNullable<Session['user']>) => {
  if (user.name) {
    const [firstName, lastName] = user.name.split(' ');
    return firstName && lastName ? `${firstName} ${lastName}` : firstName;
  }
  if (user.email) {
    const [email] = user.email.split('@');
    const [firstName, lastName] = email.split('.');
    return firstName && lastName
      ? `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`
      : firstName;
  }
  return '';
};

export const getInitials = (user: NonNullable<Session['user']>) => {
  if (user.name) {
    const [firstName, lastName] = user.name.split(' ');
    return firstName && lastName
      ? `${firstName[0]}${lastName[0]}`
      : firstName[0];
  }
  if (user.email) {
    const [email] = user.email.split('@');
    const [firstName, lastName] = email.split('.');
    return firstName && lastName
      ? `${capitalizeFirstLetter(firstName)[0]}${
          capitalizeFirstLetter(lastName)[0]
        }`
      : capitalizeFirstLetter(firstName[0]);
  }
  return '';
};
