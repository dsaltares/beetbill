import type { PropsWithChildren } from 'react';

const FullScreenCard = ({ children }: PropsWithChildren) => (
  <div className="flex w-full justify-center items-center">
    <div className="flex border rounded-lg border-zinc-300 bg-zinc-50 w-full lg:max-w-[980px] p-4 lg:p-8">
      {children}
    </div>
  </div>
);

export default FullScreenCard;
