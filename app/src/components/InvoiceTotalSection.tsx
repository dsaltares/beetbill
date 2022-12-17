import { formatAmount } from '@lib/format';
import calculateTotal from '@lib/invoices/calculateTotal';
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
      <div className="flex text-sm font-medium justify-end">
        {formatAmount(exclVat, currency)}
      </div>
      <div className="flex text-lg font-bold">Total amount due</div>
      <div className="flex text-lg font-bold justify-end">
        {formatAmount(total, currency)}
      </div>
    </div>
  );
};

const useInvoiceTotals = (items: LineItem[]) =>
  calculateTotal(
    items.map(({ quantity, ...item }) => ({
      ...item,
      quantity: parseFloat(quantity),
    }))
  );

export default InvoiceTotalSection;
