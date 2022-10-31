import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';
import CreateEditProductForm from '@components/CreateEditProductForm';
import FullScreenSpinner from '@components/Layout/FullScreenSpinner';
import WithAuthentication from '@components/WithAuthentication';
import useProduct from '@lib/products/useProduct';
import Routes from '@lib/routes';
import AppName from '@lib/appName';

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

  const content = product ? (
    <CreateEditProductForm product={product} />
  ) : (
    <FullScreenSpinner />
  );

  return (
    <>
      <Head>
        <title>{`${product?.name ?? 'Product'} - ${AppName}`}</title>
      </Head>
      {content}
    </>
  );
};

export default WithAuthentication(EditProductPage);
