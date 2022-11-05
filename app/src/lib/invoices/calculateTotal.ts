import type { Invoice } from '@server/invoices/types';

const calculateTotal = ({ items }: Invoice) =>
  items.reduce((acc, item) => {
    const {
      quantity,
      product: { price, vat, includesVat },
    } = item;
    const priceWithVat = includesVat ? price : price * (1 + vat / 100);
    return acc + quantity * priceWithVat;
  }, 0);

export default calculateTotal;
