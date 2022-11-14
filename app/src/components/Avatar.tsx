/* eslint-disable @next/next/no-img-element */
import type { Session } from 'next-auth';
import { getInitials } from '@lib/userName';
import UserPlaceholderIcon from './Icons/UserPlaceholderIcon';

type AvatarProps = {
  user: NonNullable<Session['user']>;
};

const Avatar = ({ user }: AvatarProps) => {
  if (user.image) {
    return (
      <img
        className="w-[35px] h-[35px] rounded-full"
        src={user.image}
        alt="Avatar"
        aria-hidden
        referrerPolicy="no-referrer"
      />
    );
  }

  const initials = getInitials(user);
  return initials ? (
    <div className="inline-flex overflow-hidden relative justify-center items-center w-[35px] h-[35px] bg-gray-100 rounded-full">
      <span className="font-medium text-zinc-800">{initials}</span>
    </div>
  ) : (
    <div className="overflow-hidden relative w-[35px] h-[35px] bg-zinc-100 rounded-full">
      <UserPlaceholderIcon className="absolute -left-1 w-12 h-12 text-zinc-400" />
    </div>
  );
};

export default Avatar;
