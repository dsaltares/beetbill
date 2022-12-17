import { useRouter } from 'next/router';
import { useCallback } from 'react';

const useFilterFromUrl = (): [string, (newFilter: string) => void] => {
  const { query, replace } = useRouter();
  const setFilter = useCallback(
    (newFilter: string) => {
      void replace({ query: { ...query, filter: newFilter } }, undefined, {
        shallow: true,
      });
    },
    [query, replace]
  );

  return [(query.filter || '') as string, setFilter];
};

export default useFilterFromUrl;
