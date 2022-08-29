import useProducts from '@lib/products/useProducts';
import ProductListItem from './ProductListItem';
import Spinner from './Spinner';

const ProductsList = () => {
  const { data: products, isLoading } = useProducts();
  if (isLoading) {
    return <Spinner />;
  }

  if (!products || products.length === 0) {
    return <p>No products found</p>;
  }
  return (
    <ul>
      {products.map((product) => (
        <ProductListItem key={product.id} product={product} />
      ))}
    </ul>
  );
};

export default ProductsList;
