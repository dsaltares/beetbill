import type { PropsWithChildren } from 'react';

const Table = ({ children }: PropsWithChildren) => (
  <div className="relative flex w-full h-full overflow-x-auto overflow-y-visible">
    <table className="w-full whitespace-nowrap text-left text-base text-zinc-900 border-separate border-spacing-y-0 pb-4">
      {children}
    </table>
  </div>
);

export const Head = ({ children }: PropsWithChildren) => (
  <thead className="text-sm font-medium">{children}</thead>
);

export const Body = ({ children }: PropsWithChildren) => (
  <tbody>{children}</tbody>
);

export const HeaderCell = ({ children }: PropsWithChildren) => (
  <th
    scope="col"
    className="py-1 pr-0.5 pl-0.5 first:pl-0 last:pr-0 font-medium"
  >
    {children}
  </th>
);

export const BodyCell = ({ children }: PropsWithChildren) => (
  <td className="py-1 pr-0.5 pl-0.5 first:pl-0 last:pr-0">{children}</td>
);

export default Table;
