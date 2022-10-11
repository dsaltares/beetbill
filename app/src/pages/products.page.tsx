import EmptyContent from '@components/EmptyContent';
import WithAuthentication from '@components/WithAuthentication';

const ProductsPage = () => (
  <EmptyContent
    message="You don't have any products yet"
    actionLabel="Add products"
    onClick={() => {}}
  />
);

export default WithAuthentication(ProductsPage);
