import EmptyContent from '@components/EmptyContent';
import WithAuthentication from '@components/WithAuthentication';

const InvoicesPage = () => (
  <EmptyContent
    message="You don't have any invoices yet"
    actionLabel="Add invoices"
    onClick={() => {}}
  />
);

export default WithAuthentication(InvoicesPage);
