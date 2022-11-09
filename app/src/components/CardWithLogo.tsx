import type { PropsWithChildren } from 'react';
import Card from './Card';
import Logo from './Logo';

const CardWithLogo = ({ children }: PropsWithChildren) => (
  <div className="flex flex-col justify-center gap-6">
    <Logo />
    <Card>{children}</Card>
  </div>
);

export default CardWithLogo;
