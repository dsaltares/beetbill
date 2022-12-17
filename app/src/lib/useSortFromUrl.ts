import type { ParsedUrlQuery } from 'querystring';
import type { ColumnSort } from '@tanstack/react-table';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';

const useSortFromUrl = () => {
  const { query, push } = useRouter();
  const sortBy = query.sortBy as string | undefined;
  const sortDir = query.sortDir as string | undefined;
  const sorting: ColumnSort[] = useMemo(
    () => (sortBy ? [{ id: sortBy, desc: sortDir === 'desc' }] : []),
    [sortBy, sortDir]
  );
  const toggleSort = useCallback(
    (id: string) => {
      let newSortBy: string | undefined;
      let newSortDir: string | undefined;

      if (sortBy === id && sortDir === 'desc') {
        newSortBy = id;
        newSortDir = 'asc';
      } else if (sortBy === id && sortDir === 'asc') {
        newSortBy = undefined;
        newSortDir = undefined;
      } else {
        newSortBy = id;
        newSortDir = 'desc';
      }
      void push(
        {
          query: removeIfUndefined(
            {
              ...query,
              sortBy: newSortBy,
              sortDir: newSortDir,
            },
            ['sortBy', 'sortDir']
          ),
        },
        undefined,
        { shallow: true }
      );
    },
    [push, query, sortBy, sortDir]
  );
  return {
    sorting,
    toggleSort,
  };
};

const removeIfUndefined = (query: ParsedUrlQuery, keys: string[]) =>
  Object.keys(query)
    .filter((key) => !keys.includes(key) || query[key] !== undefined)
    .reduce((acc, key) => ({ ...acc, [key]: query[key] }), {});

export default useSortFromUrl;
