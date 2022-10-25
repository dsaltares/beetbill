import type { Company, CompanyState } from '@prisma/client';
import type { Company as APICompany } from './types';

type Entity = Company & { states: CompanyState[] };

const mapCompanyEntity = ({ states, ...company }: Entity): APICompany => ({
  ...states[0],
  ...company,
});

export default mapCompanyEntity;
