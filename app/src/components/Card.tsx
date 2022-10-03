import type { PropsWithChildren } from 'react';

const Card = ({ children }: PropsWithChildren) => (
  <div className="flex flex-col p-8 bg-white shadow-[0_-12px_50px_0px_rgb(0,0,0,0.25)] md:shadow-2xl rounded-t-xl md:rounded-xl w-full max-w-[402px] gap-10">
    {children}
  </div>
);

export default Card;
