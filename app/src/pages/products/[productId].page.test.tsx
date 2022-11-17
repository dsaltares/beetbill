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
import type { Product } from '@server/products/types';
import Routes from '@lib/routes';
import ProductPage from './[productId].page';

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
const productId = 'product_1';
const router = {
  pathname: '/products/[productId]',
  query: { productId },
};
const product: Product = {
  id: productId,
  name: 'product_name',
  includesVat: false,
  price: 10,
  currency: 'GBP',
  vat: 15,
  unit: 'm',
  companyId,
  createdAt: now,
  updatedAt: now,
};

describe('ProductPage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('allows the user to edit the product', async () => {
    server.resetHandlers(
      mockTrpcQuery('getProduct', product),
      mockTrpcMutation('updateProduct', product)
    );

    render(<ProductPage />, { session, router });

    await userEvent.type(await screen.findByLabelText('Name'), 'new name');

    await act(async () => {
      await fireEvent.click(
        screen.getByRole('button', { name: 'Save product' })
      );
    });

    await screen.findByText('Successfully updated product!');
    expect(mockRouter.push).toHaveBeenCalledWith(Routes.products);
  });

  it('shows error message when failing to update a product', async () => {
    server.resetHandlers(
      mockTrpcQuery('getProduct', product),
      mockTrpcMutationError(
        'updateProduct',
        new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      )
    );

    render(<ProductPage />, { session, router });

    await userEvent.type(await screen.findByLabelText('Name'), 'new name');

    await act(async () => {
      await fireEvent.click(
        screen.getByRole('button', { name: 'Save product' })
      );
    });

    await screen.findByText('Failed to update product');
  });

  it('redirects to the 404 page when the product is not found', async () => {
    server.resetHandlers(
      mockTrpcQueryError('getProduct', new TRPCError({ code: 'NOT_FOUND' }))
    );

    render(<ProductPage />, { session, router });

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(Routes.notFound)
    );
  });
});
