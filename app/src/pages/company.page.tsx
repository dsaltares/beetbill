import CompanyForm from '@components/CompanyForm';
import FullScreenSpinner from '@components/Layout/FullScreenSpinner';
import WithAuthentication from '@components/WithAuthentication';
import useCompany from '@lib/companies/useCompany';

const CompanyPage = () => {
  const { data: company } = useCompany();
  return company ? <CompanyForm company={company} /> : <FullScreenSpinner />;
};

export default WithAuthentication(CompanyPage);
