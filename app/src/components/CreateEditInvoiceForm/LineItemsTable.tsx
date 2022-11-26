import type { PropsWithChildren } from 'react';

const LineItemsTable = ({ children }: PropsWithChildren) => (
  <div className="relative flex w-full h-full overflow-x-auto overflow-y-visible">
    <table className="w-full whitespace-nowrap text-left text-base text-zinc-900 border-separate border-spacing-y-0 pb-4">
      <thead className="text-sm font-medium">
        <tr>
          <HeaderCell></HeaderCell>
          <HeaderCell>Product</HeaderCell>
          <HeaderCell>Date</HeaderCell>
          <HeaderCell>Quantity</HeaderCell>
          <HeaderCell>Price</HeaderCell>
          <HeaderCell>VAT</HeaderCell>
          <HeaderCell>Total</HeaderCell>
          <HeaderCell></HeaderCell>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

const HeaderCell = ({ children }: PropsWithChildren) => (
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

export default LineItemsTable;
