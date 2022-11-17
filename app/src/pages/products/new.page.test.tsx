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
} from '@lib/testing';
import type { Product } from '@server/products/types';
import Routes from '@lib/routes';
import NewProductPage from './new.page';

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
const router = {
  pathname: Routes.createProduct,
};
const product: Product = {
  id: 'product_id',
  name: 'product_name',
  includesVat: false,
  price: 10,
  currency: 'GBP',
  vat: 15,
  unit: 'months',
  companyId,
  createdAt: now,
  updatedAt: now,
};

describe('NewProductPage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('allows the user to create a new product', async () => {
    render(<NewProductPage />, { session, router });

    await userEvent.type(screen.getByLabelText('Name'), product.name);
    await fireEvent.click(screen.getByLabelText('Includes VAT'));
    await userEvent.type(
      screen.getByLabelText('Price'),
      product.price.toString() as string
    );
    await fireEvent.click(screen.getByRole('button', { name: 'EUR' }));
    await fireEvent.click(await screen.findByText(product.currency!));
    await userEvent.type(
      screen.getByLabelText('VAT'),
      product.vat.toString() as string
    );
    await fireEvent.click(screen.getByRole('button', { name: 'hours' }));
    await fireEvent.click(await screen.findByText(product.unit!));

    server.resetHandlers(
      mockTrpcMutation('createProduct', product),
      mockTrpcQuery('getProducts', [product])
    );

    await fireEvent.click(screen.getByRole('button', { name: 'Add product' }));

    await screen.findByText('Successfully created product!');
    expect(mockRouter.push).toHaveBeenCalledWith(Routes.products);
  });

  it('forces the user to enter a name', async () => {
    render(<NewProductPage />, { session, router });

    await fireEvent.click(screen.getByRole('button', { name: 'Add product' }));

    await screen.findByText('Product name is required');
  });

  it('shows error message when failing to create a product', async () => {
    render(<NewProductPage />, { session, router });

    await userEvent.type(screen.getByLabelText('Name'), product.name);

    server.resetHandlers(
      mockTrpcMutationError(
        'createProduct',
        new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      )
    );

    await fireEvent.click(screen.getByRole('button', { name: 'Add product' }));

    await screen.findByText('Failed to create product');
  });
});
