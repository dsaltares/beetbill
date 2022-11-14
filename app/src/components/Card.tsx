import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { PropsWithChildren } from 'react';
import type { IconProp } from './Icons/types';

type CardProps = PropsWithChildren<{
  icon?: IconProp;
  title: string;
}>;

const Card = ({ icon, title, children }: CardProps) => (
  <div className="flex flex-col p-8 bg-white shadow-[0_-12px_50px_0px_rgb(0,0,0,0.25)] lg:shadow-2xl rounded-t-3xl lg:rounded-3xl w-full lg:max-w-[640px] gap-8">
    <div className="flex flex-col justify-center gap-3">
      {icon && (
        <FontAwesomeIcon className="text-4xl text-violet-800 " icon={icon} />
      )}
      <h1 className="text-2xl font-bold text-center mb-2">{title}</h1>
    </div>
    {children}
  </div>
);

export default Card;
