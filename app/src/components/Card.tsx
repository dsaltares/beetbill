import type { PropsWithChildren } from 'react';

const Card = ({ children }: PropsWithChildren) => (
  <div className="flex flex-col p-8 bg-white shadow-[0_-12px_50px_0px_rgb(0,0,0,0.25)] lg:shadow-2xl rounded-t-xl lg:rounded-xl w-full lg:max-w-[402px] gap-10">
    {children}
  </div>
);

export default Card;
