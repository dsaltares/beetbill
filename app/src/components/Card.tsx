import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { PropsWithChildren } from 'react';
import Logo from './Logo';

type CardProps = PropsWithChildren<{
  icon?: IconProp;
  title: string;
}>;

const Card = ({ icon, title, children }: CardProps) => (
  <div className="flex flex-col w-full items-center justify-center gap-6">
    <Logo />
    <div className="flex flex-col p-8 bg-white lg:shadow-2xl rounded-t-3xl lg:rounded-3xl w-full lg:max-w-[640px] gap-8">
      <div className="flex flex-col justify-center gap-3">
        {icon && (
          <FontAwesomeIcon className="text-4xl text-violet-800 " icon={icon} />
        )}
        <h1 className="text-2xl font-bold text-center mb-2">{title}</h1>
      </div>
      {children}
    </div>
  </div>
);

export default Card;
