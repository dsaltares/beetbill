import EmptyContent from '@components/EmptyContent';
import WithAuthentication from '@components/WithAuthentication';
import Routes from '@lib/routes';

const InvoicesPage = () => (
  <EmptyContent
    message="You don't have any invoices yet"
    createLabel="Add invoices"
    createHref={Routes.createInvoice}
  />
);

export default WithAuthentication(InvoicesPage);
