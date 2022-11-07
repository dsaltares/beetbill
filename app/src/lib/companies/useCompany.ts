import { useQuery } from '@tanstack/react-query';
import api from '@lib/api';
import QueryKeys from './queryKeys';

const useCompany = () => {
  const { data, ...rest } = useQuery(QueryKeys.company, () =>
    api.getCompany.query()
  );
  return {
    data,
    isValid: !!data && data.name && data.number,
    ...rest,
  };
};

export default useCompany;
