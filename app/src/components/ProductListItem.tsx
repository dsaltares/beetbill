import type { Product } from '@server/products/types';

type ProductListItemProps = {
  product: Product;
};

const ProductListItem = ({ product }: ProductListItemProps) => (
  <li>{product.name}</li>
);

export default ProductListItem;
