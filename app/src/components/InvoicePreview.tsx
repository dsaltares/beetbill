import { PDFViewer } from '@react-pdf/renderer';
import {
  faArrowLeft,
  faCheck,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import { useCallback } from 'react';
import type { Invoice } from '@server/invoices/types';
import Routes from '@lib/routes';
import getTitle from '@lib/invoices/getTitle';
import useSticky from '@lib/useSticky';
import useUpdateInvoice from '@lib/invoices/useUpdateInvoice';
import downloadInvoice from '@lib/invoices/downloadInvoice';
import InvoicePDF from './InvoicePDF';
import LinkButton from './LinkButton';
import Button from './Button';

type InvoicePreviewProps = {
  invoice: Invoice;
};

const InvoicePreview = ({ invoice }: InvoicePreviewProps) => {
  const { ref, height } = useSticky();
  const { mutateAsync: updateInvoice, isLoading } = useUpdateInvoice();

  const handleApproveAndDownload = useCallback(async () => {
    const updatedInvoice = await updateInvoice({
      id: invoice.id,
      status: 'SENT',
    });
    await downloadInvoice(updatedInvoice);
  }, [invoice.id, updateInvoice]);
  const handleDownload = useCallback(() => downloadInvoice(invoice), [invoice]);

  return (
    <div className="w-full h-full flex flex-col">
      <div
        ref={ref}
        className="fixed top-0 z-10 flex flex-wrap w-full p-4 items-center justify-between bg-violet-800"
      >
        <div className="flex items-center gap-6">
          <LinkButton
            href={Routes.invoice(invoice.id)}
            startIcon={faArrowLeft}
            color="tertiary"
            variant="borderless"
          >
            Back
          </LinkButton>
          <h1 className="font-bold text-zinc-50 text-2xl">
            {`Invoice ${getTitle(invoice)}`}
          </h1>
        </div>
        {invoice.status === 'DRAFT' ? (
          <Button
            variant="light"
            endIcon={faCheck}
            onClick={handleApproveAndDownload}
            loading={isLoading}
          >
            Approve and download
          </Button>
        ) : (
          <Button variant="light" endIcon={faDownload} onClick={handleDownload}>
            Download
          </Button>
        )}
      </div>
      <div
        className="flex w-full flex-shrink-0"
        style={{
          height: `${height}px`,
        }}
      />
      <PDFViewer className="w-full h-full" showToolbar={false}>
        <InvoicePDF invoice={invoice} />
      </PDFViewer>
    </div>
  );
};

export default InvoicePreview;
