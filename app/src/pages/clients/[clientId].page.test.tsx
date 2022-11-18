import 'next';
import { setupServer } from 'msw/node';
import type { Session } from 'next-auth';
import userEvent from '@testing-library/user-event';
import { TRPCError } from '@trpc/server';
import {
  mockRouter,
  mockTrpcMutation,
  mockTrpcMutationError,
  mockTrpcQuery,
  render,
  screen,
  fireEvent,
  act,
  mockTrpcQueryError,
  waitFor,
} from '@lib/testing';
import Routes from '@lib/routes';
import type { Client } from '@server/clients/types';
import ClientPage from './[clientId].page';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const now = new Date().toISOString();
const companyId = 'company_1';
const session: Session = {
  user: {},
  userId: 'user_1',
  companyId: companyId,
  expires: '',
};
const clientId = 'client_1';
const router = {
  pathname: '/clients/[clientId]',
  query: { clientId },
};
const client: Client = {
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
  companyId,
  createdAt: now,
  updatedAt: now,
};

describe('ClientPage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('allows the user to edit the client', async () => {
    server.resetHandlers(
      mockTrpcQuery('getClient', client),
      mockTrpcMutation('updateClient', client)
    );

    render(<ClientPage />, { session, router });

    await userEvent.type(await screen.findByLabelText('Name'), 'new name');

    await act(async () => {
      await fireEvent.click(
        screen.getByRole('button', { name: 'Save client' })
      );
    });

    await screen.findByText('Successfully updated client!');
    expect(mockRouter.push).toHaveBeenCalledWith(Routes.clients);
  });

  it('shows error message when failing to update a client', async () => {
    server.resetHandlers(
      mockTrpcQuery('getClient', client),
      mockTrpcMutationError(
        'updateClient',
        new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      )
    );

    render(<ClientPage />, { session, router });

    await userEvent.type(await screen.findByLabelText('Name'), 'new name');

    await act(async () => {
      await fireEvent.click(
        screen.getByRole('button', { name: 'Save client' })
      );
    });

    await screen.findByText('Failed to update client');
  });

  it('redirects to the 404 page when the client is not found', async () => {
    server.resetHandlers(
      mockTrpcQueryError('getClient', new TRPCError({ code: 'NOT_FOUND' }))
    );

    render(<ClientPage />, { session, router });

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(Routes.notFound)
    );
  });
});
