import Head from 'next/head';
import WithAuthentication from '@components/WithAuthentication';
import AppName from '@lib/appName';
import useClients from '@lib/clients/useClients';
import useLatestNumberByPrefix from '@lib/invoices/useLatestNumberByPrefix';
import useCompany from '@lib/companies/useCompany';
import FullScreenSpinner from '@components/Layout/FullScreenSpinner';
import CreateEditInvoiceForm from '@components/CreateEditInvoiceForm';
import EmptyContent from '@components/EmptyContent';
import Routes from '@lib/routes';
import useProducts from '@lib/products/useProducts';

const NewInvoicePage = () => {
  const { data: clients, isLoading: isLoadingClients } = useClients();
  const { data: products, isLoading: isLoadingProducts } = useProducts();
  const {
    data: company,
    isValid: isValidCompany,
    isLoading: isLoadingCompany,
  } = useCompany();
  const { data: numberByPrefix, isLoading: isLoadingInvoices } =
    useLatestNumberByPrefix();
  const hasLoaded =
    company &&
    !isLoadingClients &&
    !isLoadingProducts &&
    !isLoadingCompany &&
    !isLoadingInvoices;

  let content = null;
  if (!hasLoaded) {
    content = <FullScreenSpinner />;
  } else if (!isValidCompany) {
    content = (
      <EmptyContent
        message="Before creating invoices, you need to add your company details."
        createLabel="Add company details"
        createHref={Routes.company}
      />
    );
  } else if (!products || products?.length === 0) {
    content = (
      <EmptyContent
        message="Before creating invoices, you need to add some products."
        createLabel="Add products"
        createHref={Routes.createProduct}
      />
    );
  } else if (!clients || clients?.length === 0) {
    content = (
      <EmptyContent
        message="Before creating invoices, you need to add at least a client."
        createLabel="Add clients"
        createHref={Routes.createClient}
      />
    );
  } else {
    content = (
      <CreateEditInvoiceForm
        company={company}
        clients={clients}
        products={products}
        numberByPrefix={numberByPrefix}
      />
    );
  }

  return (
    <>
      <Head>
        <title>{`New invoice - ${AppName}`}</title>
      </Head>
      {content}
    </>
  );
};

export default WithAuthentication(NewInvoicePage);
