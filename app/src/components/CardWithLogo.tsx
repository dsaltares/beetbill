import type { PropsWithChildren } from 'react';
import Card from './Card';
import type { IconProp } from './Icons/types';
import Logo from './Logo';

type CardWithLogoProps = PropsWithChildren<{
  title: string;
  icon?: IconProp;
}>;

const CardWithLogo = ({ title, icon, children }: CardWithLogoProps) => (
  <div className="flex flex-col w-full items-center justify-center gap-6">
    <Logo />
    <Card title={title} icon={icon}>
      {children}
    </Card>
  </div>
);

export default CardWithLogo;
