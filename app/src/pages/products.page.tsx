import Link from 'next/link';
import ProductsList from '@components/ProductsList';

const ProductsPage = () => (
  <div className="flex flex-col gap-4">
    <Link href="/products/new">
      <a>New product</a>
    </Link>
    <ProductsList />
  </div>
);

export default ProductsPage;
