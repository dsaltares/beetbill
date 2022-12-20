import {
  faSort,
  faSortDown,
  faSortUp,
} from '@fortawesome/free-solid-svg-icons';
import type { SortDirection } from '@tanstack/react-table';
import cn from 'classnames';
import type { PropsWithChildren } from 'react';

export const Table = ({ children }: PropsWithChildren) => (
  <div className="relative block w-full overflow-x-auto">
    <table className="w-full whitespace-nowrap text-left text-base text-zinc-900 border-separate border-spacing-y-2">
      {children}
    </table>
  </div>
);

export const Head = ({ children }: PropsWithChildren) => (
  <thead>{children}</thead>
);

export const Body = ({ children }: PropsWithChildren) => (
  <tbody>{children}</tbody>
);

export const HeaderRow = ({ children }: PropsWithChildren) => (
  <tr>{children}</tr>
);

export const BodyRow = ({ children }: PropsWithChildren) => (
  <tr className="bg-zinc-50">{children}</tr>
);

export const HeaderCell = ({ children }: PropsWithChildren) => (
  <th scope="col" className="py-2.5 px-3 min-w-[86px]">
    {children}
  </th>
);

type BodyCellProps = PropsWithChildren<{
  header?: boolean;
  wrap?: boolean;
}>;

export const BodyCell = ({ header, children, wrap }: BodyCellProps) => {
  const baseClass =
    'py-4 px-6 first:rounded-l-md last:rounded-r-md border-y first:border-l last:border-r border-zinc-300 min-w-[86px]';
  const conditionalClass = {
    'whitespace-normal max-w-[300px]': !!wrap,
  };
  return header ? (
    <th
      scope="row"
      className={cn(
        'text-xl font-medium whitespace-normal',
        baseClass,
        conditionalClass
      )}
    >
      {children}
    </th>
  ) : (
    <td className={cn(baseClass, conditionalClass)}>{children}</td>
  );
};

export const getSortingIcon = (sort: false | SortDirection) => {
  if (!sort) {
    return faSort;
  }
  return sort === 'asc' ? faSortUp : faSortDown;
};
