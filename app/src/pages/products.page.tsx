import EmptyContent from '@components/EmptyContent';
import WithAuthentication from '@components/WithAuthentication';
import Routes from '@lib/routes';

const ProductsPage = () => (
  <EmptyContent
    message="You don't have any products yet"
    createLabel="Add products"
    createHref={Routes.createProduct}
  />
);

export default WithAuthentication(ProductsPage);
