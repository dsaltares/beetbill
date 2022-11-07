import type { Product } from '@server/products/types';

type LineItem = {
  product: Product;
  date: string;
  quantity: string;
};

type InvoiceTotalSectionProps = {
  items: LineItem[];
};

const InvoiceTotalSection = ({ items }: InvoiceTotalSectionProps) => {
  const { exclVat, total, currency } = useInvoiceTotals(items);
  return (
    <div className="grid grid-cols-2 w-full items-center">
      <div className="flex text-sm font-medium">Total excl. VAT</div>
      <div className="flex text-sm font-medium justify-end">{`${exclVat.toFixed(
        2
      )} ${currency}`}</div>
      <div className="flex text-lg font-bold">Total amount due</div>
      <div className="flex text-lg font-bold justify-end">{`${total.toFixed(
        2
      )} ${currency}`}</div>
    </div>
  );
};

const useInvoiceTotals = (items: LineItem[]) => {
  if (items.length === 0) {
    return {
      exclVat: 0,
      total: 0,
      currency: '',
    };
  }
  const currency = items[0].product.currency;
  const [exclVat, total] = items.reduce(
    ([exclVatAcc, totalAcc], { product, quantity }) => {
      const basePrice = product.price * parseInt(quantity || '1', 10);
      const priceExclVat = product.includesVat
        ? basePrice / (1 + product.vat / 100.0)
        : basePrice;
      const priceWithVat = priceExclVat * (1 + product.vat / 100.0);
      return [exclVatAcc + priceExclVat, totalAcc + priceWithVat];
    },
    [0, 0] as [number, number]
  );
  return {
    exclVat,
    total,
    currency,
  };
};

export default InvoiceTotalSection;
