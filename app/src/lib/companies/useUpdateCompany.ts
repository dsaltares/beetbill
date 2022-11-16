import api from '@lib/api';
import useMutation from '@lib/useMutation';
import type {
  UpdateCompanyInput,
  GetCompanyOutput,
} from '@server/company/types';
import QueryKeys from './queryKeys';

const useUpdateCompany = () =>
  useMutation<UpdateCompanyInput, GetCompanyOutput>({
    mutationFn: api.updateCompany.mutate,
    cacheKey: QueryKeys.company,
    cacheUpdater: (company, input) => {
      if (company) {
        Object.assign(company, input);
      }
    },
    successMessage: () => 'Successfully updated company!',
    errorMessage: () => 'Failed to update company',
  });

export default useUpdateCompany;
