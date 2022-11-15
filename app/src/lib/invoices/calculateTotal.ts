import type { Product } from '@server/products/types';

interface LineItem {
  product: Product;
  date: string;
  quantity: number;
}

const calculateTotal = (items: LineItem[]) => {
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
      const basePrice = product.price * quantity;
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

export default calculateTotal;
