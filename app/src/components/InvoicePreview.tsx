import { PDFViewer } from '@react-pdf/renderer';
import type { Invoice } from '@server/invoices/types';
import InvoiceDocument from './InvoicePDF';

type InvoicePreviewProps = {
  invoice: Invoice;
};

const InvoicePreview = ({ invoice }: InvoicePreviewProps) => (
  <PDFViewer className="w-full h-full">
    <InvoiceDocument invoice={invoice} />
  </PDFViewer>
);

export default InvoicePreview;
