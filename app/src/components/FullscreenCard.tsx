import type { PropsWithChildren } from 'react';

const FullScreenCard = ({ children }: PropsWithChildren) => (
  <div className="flex w-full justify-center items-center md:mt-12">
    <div className="flex border rounded-lg border-zinc-300 bg-zinc-50 w-full md:max-w-[900px] p-4 md:p-8">
      {children}
    </div>
  </div>
);

export default FullScreenCard;
