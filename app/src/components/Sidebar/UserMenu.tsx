import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Session } from 'next-auth';
import { useSession } from 'next-auth/react';

const getName = (user: NonNullable<Session['user']>) =>
  user.name || user.email || '';

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
