import { useRouter } from 'next/router';
import { useEffect } from 'react';
import CreateEditProductForm from '@components/CreateEditProductForm';
import FullScreenSpinner from '@components/Layout/FullScreenSpinner';
import WithAuthentication from '@components/WithAuthentication';
import useProduct from '@lib/products/useProduct';
import Routes from '@lib/routes';

const EditProductPage = () => {
  const router = useRouter();
  const { data: product, isError } = useProduct(
    router.query.productId as string
  );

  useEffect(() => {
    if (isError) {
      void router.push(Routes.notFound);
    }
  }, [router, isError]);

  return product ? (
    <CreateEditProductForm product={product} />
  ) : (
    <FullScreenSpinner />
  );
};

export default WithAuthentication(EditProductPage);
