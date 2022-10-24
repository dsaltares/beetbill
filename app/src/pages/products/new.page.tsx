import CreateEditProductForm from '@components/CreateEditProductForm';
import WithAuthentication from '@components/WithAuthentication';

const NewProductPage = () => <CreateEditProductForm />;

export default WithAuthentication(NewProductPage);
