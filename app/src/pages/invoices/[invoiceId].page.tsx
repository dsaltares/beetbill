import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';
import FullScreenSpinner from '@components/Layout/FullScreenSpinner';
import WithAuthentication from '@components/WithAuthentication';
import Routes from '@lib/routes';
import AppName from '@lib/appName';
import useInvoice from '@lib/invoices/useInvoice';
import useClients from '@lib/clients/useClients';
import useProducts from '@lib/products/useProducts';
import useCompany from '@lib/companies/useCompany';
import CreateEditInvoiceForm from '@components/CreateEditInvoiceForm';
import useLatestNumberByPrefix from '@lib/invoices/useLatestNumberByPrefix';

const EditInvoicePage = () => {
  const router = useRouter();
  const { data: invoice, isError: isInvoiceError } = useInvoice(
    router.query.invoiceId as string
  );
  const {
    data: clients,
    isError: isClientsError,
    isLoading: isLoadingClients,
  } = useClients();
  const {
    data: products,
    isError: isProductsError,
    isLoading: isLoadingProducts,
  } = useProducts();
  const {
    data: company,
    isLoading: isLoadingCompany,
    isError: isCompanyError,
  } = useCompany();
  const {
    data: numberByPrefix,
    isError: isNumbersError,
    isLoading: isLoadingInvoices,
  } = useLatestNumberByPrefix();
  const isError =
    isInvoiceError ||
    isClientsError ||
    isProductsError ||
    isCompanyError ||
    isNumbersError;
  const hasLoaded =
    !isError &&
    invoice &&
    company &&
    !isLoadingClients &&
    !isLoadingProducts &&
    !isLoadingCompany &&
    !isLoadingInvoices;

  useEffect(() => {
    if (isError) {
      void router.push(Routes.notFound);
    }
  }, [router, isError]);

  const content = hasLoaded ? (
    <CreateEditInvoiceForm
      company={company}
      invoice={invoice}
      products={products!}
      clients={clients!}
      numberByPrefix={numberByPrefix}
    />
  ) : (
    <FullScreenSpinner />
  );

  return (
    <>
      <Head>
        <title>{`Invoice - ${AppName}`}</title>
      </Head>
      {content}
    </>
  );
};

export default WithAuthentication(EditInvoicePage);
