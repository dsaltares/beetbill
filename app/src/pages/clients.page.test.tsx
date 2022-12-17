import 'next';
import { setupServer } from 'msw/node';
import type { Session } from 'next-auth';
import { TRPCError } from '@trpc/server';
import {
  act,
  fireEvent,
  mockRouter,
  mockTrpcMutation,
  mockTrpcMutationError,
  mockTrpcQuery,
  render,
  screen,
  waitFor,
} from '@lib/testing';
import Routes from '@lib/routes';
import type { Client } from '@server/clients/types';
import ClientsPage from './clients.page';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const session: Session = {
  user: {},
  userId: 'user_1',
  companyId: 'company_1',
  expires: '',
};
const router = {
  pathname: '/products',
};
const client1: Client = {
  id: 'client_1',
  name: 'Client 1',
  number: '1',
  vatNumber: '1',
  contactName: 'Ada Lovelace',
  email: 'ada@company.com',
  country: 'client_country',
  address: 'client_address',
  postCode: 'client_post_code',
  city: 'client_city',
  paymentTerms: 7,
  companyId: 'company_1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  toBePaid: { value: 100, currency: 'EUR' },
  paid: { value: 150, currency: 'EUR' },
};
const client2: Client = {
  id: 'client_2',
  name: 'Client 2',
  number: '2',
  vatNumber: '2',
  contactName: null,
  email: 'nikola@company.com',
  country: 'client_country',
  address: 'client_address',
  postCode: 'client_post_code',
  city: 'client_city',
  paymentTerms: 30,
  companyId: 'company_1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  toBePaid: { value: 0, currency: 'EUR' },
  paid: { value: 200, currency: 'EUR' },
};
const client3: Client = {
  id: 'client_3',
  name: 'Client 3',
  number: '3',
  vatNumber: '3',
  contactName: 'Alan Turing',
  email: 'alan@company.com',
  country: 'client_country',
  address: 'client_address',
  postCode: 'client_post_code',
  city: 'client_city',
  paymentTerms: 14,
  companyId: 'company_1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  toBePaid: { value: 300, currency: 'GBP' },
  paid: { value: 0, currency: 'GBP' },
};
const clients: Client[] = [client1, client2, client3];

describe('ClientsPage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders empty screen when there are no clients', async () => {
    server.resetHandlers(mockTrpcQuery('getClients', []));

    render(<ClientsPage />, { session, router });

    await screen.findByText("You don't have any clients yet");
    await fireEvent.click(
      await screen.findByRole('link', { name: 'Add clients' })
    );

    expect(mockRouter.push).toHaveBeenCalledWith(
      Routes.createClient,
      expect.anything(),
      expect.anything()
    );
  });

  it('renders the list of clients sorted by name desc', async () => {
    server.resetHandlers(mockTrpcQuery('getClients', clients));

    render(<ClientsPage />, { session, router });

    await waitFor(() => {
      const rows = screen.getAllByRole('row').slice(1);
      expect(rows).toHaveLength(clients.length);
      expect(rows[0]).toContainHTML(clients[2].name);
      expect(rows[1]).toContainHTML(clients[1].name);
      expect(rows[2]).toContainHTML(clients[0].name);

      expect(rows[0]).toContainHTML('£300.00');
      expect(rows[1]).toContainHTML('€0.00');
      expect(rows[2]).toContainHTML('€100.00');

      expect(rows[0]).toContainHTML('£0.00');
      expect(rows[1]).toContainHTML('€200.00');
      expect(rows[2]).toContainHTML('€150.00');
    });
  });

  it('renders the list of clients with sorting driven by the URL', async () => {
    server.resetHandlers(mockTrpcQuery('getClients', clients));

    render(<ClientsPage />, {
      session,
      router: { ...router, query: { sortBy: 'name', sortDir: 'desc' } },
    });

    await waitFor(() => {
      const byNameDesc = screen.getAllByRole('row').slice(1);
      expect(byNameDesc).toHaveLength(clients.length);
      expect(byNameDesc[0]).toContainHTML(clients[2].name);
      expect(byNameDesc[1]).toContainHTML(clients[1].name);
      expect(byNameDesc[2]).toContainHTML(clients[0].name);
    });

    await act(async () => {
      await fireEvent.click(
        screen.getByRole('button', { name: 'Open invoices' })
      );
    });

    expect(mockRouter.push).toHaveBeenCalledWith(
      { query: { sortBy: 'toBePaid', sortDir: 'desc' } },
      undefined,
      expect.anything()
    );
  });

  it('has filtering driven by the URL', async () => {
    server.resetHandlers(mockTrpcQuery('getClients', clients));

    render(<ClientsPage />, {
      session,
      router: { ...router, query: { filter: client1.name } },
    });

    await waitFor(() => {
      expect(screen.getAllByRole('row')).toHaveLength(2);
    });

    await act(async () => {
      await fireEvent.change(screen.getByPlaceholderText('Search'), {
        target: { value: client2.name },
      });
    });

    expect(mockRouter.replace).toHaveBeenCalledWith(
      { query: { filter: client2.name } },
      undefined,
      expect.anything()
    );
  });

  it('redirects to client page clicking edit', async () => {
    server.resetHandlers(mockTrpcQuery('getClients', [client1]));

    render(<ClientsPage />, { session, router });

    await waitFor(() => {
      const rows = screen.getAllByRole('row').slice(1);
      expect(rows).toHaveLength(1);
      expect(rows[0]).toContainHTML(client1.name);
    });

    await fireEvent.click(await screen.findByRole('link', { name: 'Edit' }));

    expect(mockRouter.push).toHaveBeenCalledWith(
      Routes.client(client1.id),
      expect.anything(),
      expect.anything()
    );
  });

  it('allows the user to delete a client', async () => {
    server.resetHandlers(mockTrpcQuery('getClients', [client1]));

    render(<ClientsPage />, { session, router });

    await fireEvent.click(
      await screen.findByRole('button', { name: 'Delete' })
    );

    server.resetHandlers(
      mockTrpcMutation('deleteClient', client1.id),
      mockTrpcQuery('getClients', [])
    );

    await screen.findByText('Are you sure you want to delete the client?');
    const modalDeleteButton = screen.getAllByRole('button', {
      name: 'Delete',
    })[1];
    await act(async () => {
      await fireEvent.click(modalDeleteButton);
    });

    await screen.findByText('Successfully deleted client!');
    expect(screen.queryByText(client1.name)).not.toBeInTheDocument();
  });

  it('handles deletion errors', async () => {
    server.resetHandlers(mockTrpcQuery('getClients', [client1]));

    render(<ClientsPage />, { session, router });

    await fireEvent.click(
      await screen.findByRole('button', { name: 'Delete' })
    );

    await screen.findByText('Are you sure you want to delete the client?');
    const modalDeleteButton = screen.getAllByRole('button', {
      name: 'Delete',
    })[1];

    server.resetHandlers(
      mockTrpcMutationError(
        'deleteClient',
        new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      ),
      mockTrpcQuery('getClients', [client1])
    );

    await act(async () => {
      await fireEvent.click(modalDeleteButton);
    });

    await screen.findByText('Failed to delete client');
    await screen.findByText(client1.name);
  });
});
