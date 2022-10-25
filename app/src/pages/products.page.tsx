import { useCallback } from 'react';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import EmptyContent from '@components/EmptyContent';
import WithAuthentication from '@components/WithAuthentication';
import useDeleteProduct from '@lib/products/useDeleteProduct';
import useProducts from '@lib/products/useProducts';
import Routes from '@lib/routes';
import FullScreenSpinner from '@components/Layout/FullScreenSpinner';
import ProductsTable from '@components/ProductsTable';
import LinkButton from '@components/LinkButton';

const ProductsPage = () => {
  const { data: products, isLoading } = useProducts();
  const { mutate: deleteProduct } = useDeleteProduct();
  const handleDelete = useCallback(
    (productId: string) => deleteProduct({ id: productId }),
    [deleteProduct]
  );

  if (isLoading) {
    return <FullScreenSpinner />;
  }

  if (!products || products.length === 0) {
    return (
      <EmptyContent
        message="You don't have any products yet"
        createLabel="Add products"
        createHref={Routes.createProduct}
      />
    );
  }

  return (
    <div className="flex flex-col w-full gap-16">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Your products</h1>
        <LinkButton href={Routes.createProduct} endIcon={faAdd}>
          Add product
        </LinkButton>
      </div>
      <ProductsTable products={products} onDelete={handleDelete} />
    </div>
  );
};

export default WithAuthentication(ProductsPage);
