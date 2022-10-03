import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import capitalizeFirstLetter from '@lib/capitalizeFirstLetter';

const getName = (user: NonNullable<Session['user']>) => {
  if (user.name) {
    return user.name;
  }
  if (user.email) {
    const [email] = user.email.split('@');
    const [firstName, lastName] = email.split('.');
    if (firstName && lastName) {
      return `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(
        lastName
      )}`;
    }
    return firstName;
  }
  return '';
};

const UserMenu = () => {
  const { data } = useSession();
  return data?.user ? (
    <div className="flex p-4 items-center gap-4 text-white text-base">
      <FontAwesomeIcon className="w-4 h-4" icon={faUser} />
      <span>{getName(data.user)}</span>
    </div>
  ) : null;
};

export default UserMenu;
