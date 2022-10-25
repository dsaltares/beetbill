import CreateEditClientForm from '@components/CreateEditClientForm';
import WithAuthentication from '@components/WithAuthentication';

const NewClientPage = () => <CreateEditClientForm />;

export default WithAuthentication(NewClientPage);
