import type { PropsWithChildren } from 'react';

const Error = ({ children }: PropsWithChildren) => (
  <span role="alert" className="text-sm text-red-600">
    {children}
  </span>
);

export default Error;
