import saveAs from 'file-saver';
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from '@components/InvoicePDF';
import type { Invoice } from '@server/invoices/types';

const downloadInvoice = async (invoice: Invoice) => {
  const title = `invoice ${invoice.company.name} ${[
    invoice.prefix,
    invoice.number,
  ]
    .filter((part) => !!part)
    .join(' ')}`.replace(' ', '_');
  const doc = <InvoicePDF invoice={invoice} />;
  const asPdf = pdf();
  asPdf.updateContainer(doc);
  const blob = await asPdf.toBlob();
  saveAs(blob, title);
};

export default downloadInvoice;
