import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';
import FullScreenSpinner from '@components/Layout/FullScreenSpinner';
import WithAuthentication from '@components/WithAuthentication';
import Routes from '@lib/routes';
import AppName from '@lib/appName';
import useInvoice from '@lib/invoices/useInvoice';
import InvoicePreview from '@components/InvoicePreview';

const PreviewInvoicePage = () => {
  const router = useRouter();
  const { data: invoice, isError } = useInvoice(
    router.query.invoiceId as string
  );

  useEffect(() => {
    if (isError) {
      void router.push(Routes.notFound);
    }
  }, [router, isError]);

  const content = invoice ? (
    <InvoicePreview invoice={invoice} />
  ) : (
    <FullScreenSpinner />
  );

  return (
    <>
      <Head>
        <title>{`Invoice preview - ${AppName}`}</title>
      </Head>
      {content}
    </>
  );
};

export default WithAuthentication(PreviewInvoicePage);
