import EditCompanyForm from '@components/EditCompanyForm';
import FullScreenSpinner from '@components/Layout/FullScreenSpinner';
import WithAuthentication from '@components/WithAuthentication';
import useCompany from '@lib/companies/useCompany';

const CompanyPage = () => {
  const { data: company } = useCompany();
  return company ? (
    <EditCompanyForm company={company} />
  ) : (
    <FullScreenSpinner />
  );
};

export default WithAuthentication(CompanyPage);
