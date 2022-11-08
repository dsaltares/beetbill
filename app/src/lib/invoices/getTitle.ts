import type { Invoice } from '@server/invoices/types';

const getTitle = (invoice: Invoice) => {
  if (invoice.number && invoice.prefix) {
    return `${invoice.prefix} - ${invoice.number}`;
  } else if (invoice.number) {
    return invoice.number.toString();
  } else if (invoice.prefix) {
    return `${invoice.prefix} -`;
  }
};

export default getTitle;
