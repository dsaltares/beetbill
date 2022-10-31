import Head from 'next/head';
import EditCompanyForm from '@components/EditCompanyForm';
import FullScreenSpinner from '@components/Layout/FullScreenSpinner';
import WithAuthentication from '@components/WithAuthentication';
import useCompany from '@lib/companies/useCompany';
import AppName from '@lib/appName';

const CompanyPage = () => {
  const { data: company } = useCompany();
  const content = company ? (
    <EditCompanyForm company={company} />
  ) : (
    <FullScreenSpinner />
  );

  return (
    <>
      <Head>
        <title>{`${company?.name ?? 'Company'} - ${AppName}`}</title>
      </Head>
      {content}
    </>
  );
};

export default WithAuthentication(CompanyPage);
