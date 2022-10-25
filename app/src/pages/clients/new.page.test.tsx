import 'next';
import { setupServer } from 'msw/node';
import type { Session } from 'next-auth';
import { TRPCError } from '@trpc/server';
import {
  mockRouter,
  mockTrpcMutation,
  mockTrpcMutationError,
  mockTrpcQuery,
  render,
  screen,
  fireEvent,
} from '@lib/testing';
import type { Customer } from '@server/customers/types';
import Routes from '@lib/routes';
import NewClientPage from './new.page';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const companyId = 'company_1';
const session: Session = {
  user: {},
  userId: 'user_1',
  companyId: companyId,
  expires: '',
};
const router = {
  pathname: Routes.createClient,
};
const client: Customer = {
  id: 'client_id',
  name: 'client_name',
  number: 'client_number',
  vatNumber: 'client_vat_number',
  firstName: 'client_first_name',
  lastName: 'client_last_name',
  email: 'contact@company.com',
  country: 'client_country',
  address: 'client_address',
  postCode: 'client_post_code',
  city: 'client_city',
  paymentTerms: 30,
  companyId,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('NewClientPage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('allows the user to create a new client', async () => {
    render(<NewClientPage />, { session, router });

    await fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: client.name! },
    });
    await fireEvent.change(screen.getByLabelText('Number'), {
      target: { value: client.number! },
    });
    await fireEvent.change(screen.getByLabelText('VAT number'), {
      target: { value: client.vatNumber! },
    });
    await fireEvent.change(screen.getByLabelText('First name'), {
      target: { value: client.firstName! },
    });
    await fireEvent.change(screen.getByLabelText('Last name'), {
      target: { value: client.lastName! },
    });
    await fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: client.email! },
    });
    await fireEvent.change(screen.getByLabelText('Country'), {
      target: { value: client.country! },
    });
    await fireEvent.change(screen.getByLabelText('Address'), {
      target: { value: client.address! },
    });
    await fireEvent.change(screen.getByLabelText('Post code'), {
      target: { value: client.postCode! },
    });
    await fireEvent.change(screen.getByLabelText('City'), {
      target: { value: client.city! },
    });
    await fireEvent.change(screen.getByLabelText('Payment terms'), {
      target: { value: client.paymentTerms.toString() },
    });

    server.resetHandlers(
      mockTrpcMutation('createCustomer', client),
      mockTrpcQuery('getCustomers', [client])
    );

    await fireEvent.click(screen.getByRole('button', { name: 'Add client' }));

    await screen.findByText('Client created');
    expect(mockRouter.push).toHaveBeenCalledWith(Routes.clients);
  });

  it('forces the user to enter a name', async () => {
    render(<NewClientPage />, { session, router });

    await fireEvent.click(screen.getByRole('button', { name: 'Add client' }));

    await screen.findByText('Client name is required');
  });

  it('shows error message when failing to create a client', async () => {
    render(<NewClientPage />, { session, router });

    await fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: client.name! },
    });
    await fireEvent.change(screen.getByLabelText('Number'), {
      target: { value: client.number! },
    });

    server.resetHandlers(
      mockTrpcMutationError(
        'createCustomer',
        new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      )
    );

    await fireEvent.click(screen.getByRole('button', { name: 'Add client' }));

    await screen.findByText('Failed to create client');
  });
});
