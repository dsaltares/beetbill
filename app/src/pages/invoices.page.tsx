import { useCallback } from 'react';
import Head from 'next/head';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import EmptyContent from '@components/EmptyContent';
import WithAuthentication from '@components/WithAuthentication';
import Routes from '@lib/routes';
import AppName from '@lib/appName';
import useInvoices from '@lib/invoices/useInvoices';
import useDeleteInvoice from '@lib/invoices/useDeleteInvoice';
import FullScreenSpinner from '@components/Layout/FullScreenSpinner';
import LinkButton from '@components/LinkButton';
import InvoicesTable from '@components/InvoicesTable';

const InvoicesPage = () => {
  const { data: invoices, isLoading } = useInvoices();
  const { mutate: deleteInvoice } = useDeleteInvoice();
  const handleDelete = useCallback(
    (invoiceId: string) => deleteInvoice({ id: invoiceId }),
    [deleteInvoice]
  );

  let content = null;
  if (isLoading) {
    content = <FullScreenSpinner />;
  } else if (!invoices || invoices.length === 0) {
    content = (
      <EmptyContent
        message="You don't have any invoices yet"
        createLabel="Add invoice"
        createHref={Routes.createInvoice}
      />
    );
  } else {
    content = (
      <div className="flex flex-col w-full gap-16">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Your invoices</h1>
          <LinkButton href={Routes.createInvoice} endIcon={faAdd}>
            Add invoice
          </LinkButton>
        </div>
        <InvoicesTable invoices={invoices} onDelete={handleDelete} />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`Invoices - ${AppName}`}</title>
      </Head>
      {content}
    </>
  );
};

export default WithAuthentication(InvoicesPage);
