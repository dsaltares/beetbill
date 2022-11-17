import type { Company, CompanyState } from '@prisma/client';
import type { Company as APICompany } from './types';

type Entity = Company & { states: CompanyState[] };

const mapCompanyEntity = ({
  states,
  createdAt,
  ...company
}: Entity): APICompany => ({
  ...states[0],
  ...company,
  createdAt: createdAt.toISOString(),
});

export default mapCompanyEntity;
