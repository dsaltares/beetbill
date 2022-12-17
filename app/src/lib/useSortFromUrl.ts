import type { ColumnSort } from '@tanstack/react-table';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';

const useSortFromUrl = (defaultSort: ColumnSort | undefined = undefined) => {
  const { query, push } = useRouter();
  const hasSort = 'sortBy' in query;
  const sortBy = query.sortBy as string | undefined;
  const sortDir = query.sortDir as string | undefined;
  const sorting: ColumnSort[] = useMemo(() => {
    if (hasSort) {
      return sortBy ? [{ id: sortBy, desc: sortDir === 'desc' }] : [];
    }
    return defaultSort ? [defaultSort] : [];
  }, [sortBy, sortDir, defaultSort, hasSort]);
  const toggleSort = useCallback(
    (id: string) => {
      const currentSortBy = sortBy ?? defaultSort?.id;
      const currentSortDir = sortDir ?? (defaultSort?.desc ? 'desc' : 'asc');
      let newSortBy: string | undefined;
      let newSortDir: string | undefined;

      if (currentSortBy === id && currentSortDir === 'desc') {
        newSortBy = id;
        newSortDir = 'asc';
      } else if (currentSortBy === id && currentSortDir === 'asc') {
        newSortBy = undefined;
        newSortDir = undefined;
      } else {
        newSortBy = id;
        newSortDir = 'desc';
      }
      void push(
        {
          query: {
            ...query,
            sortBy: newSortBy,
            sortDir: newSortDir,
          },
        },
        undefined,
        { shallow: true }
      );
    },
    [push, query, sortBy, sortDir, defaultSort]
  );
  return {
    sorting,
    toggleSort,
  };
};

export default useSortFromUrl;
