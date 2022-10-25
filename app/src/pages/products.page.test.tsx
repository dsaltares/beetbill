import 'next';
import { setupServer } from 'msw/node';
import type { Session } from 'next-auth';
import { TRPCError } from '@trpc/server';
import userEvent from '@testing-library/user-event';
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
import type { Product } from '@server/products/types';
import ProductsPage from './products.page';

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
const product1: Product = {
  id: 'product_1',
  name: 'Product 1',
  includesVat: false,
  price: 1,
  currency: 'EUR',
  vat: 9,
  unit: 'h',
  companyId: 'company_1',
  createdAt: new Date(),
  updatedAt: new Date(),
};
const product2: Product = {
  id: 'product_2',
  name: 'Product 2',
  includesVat: false,
  price: 5,
  currency: 'GBP',
  vat: 15,
  unit: 'h',
  companyId: 'company_1',
  createdAt: new Date(),
  updatedAt: new Date(),
};
const product3: Product = {
  id: 'product_3',
  name: 'Product 3',
  includesVat: false,
  price: 10,
  currency: 'USD',
  vat: 7,
  unit: 'h',
  companyId: 'company_1',
  createdAt: new Date(),
  updatedAt: new Date(),
};
const products: Product[] = [product1, product2, product3];

describe('ProductsPage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders empty screen when there are no products', async () => {
    server.resetHandlers(mockTrpcQuery('getProducts', []));

    render(<ProductsPage />, { session, router });

    await screen.findByText("You don't have any products yet");
    await fireEvent.click(
      await screen.findByRole('link', { name: 'Add products' })
    );

    expect(mockRouter.push).toHaveBeenCalledWith(
      Routes.createProduct,
      expect.anything(),
      expect.anything()
    );
  });

  it('renders the list of products, can sort and can filter', async () => {
    server.resetHandlers(mockTrpcQuery('getProducts', products));

    render(<ProductsPage />, { session, router });

    await waitFor(() => {
      const rows = screen.getAllByRole('row').slice(1);
      expect(rows).toHaveLength(products.length);
      expect(rows[0]).toContainHTML(products[0].name);
      expect(rows[1]).toContainHTML(products[1].name);
      expect(rows[2]).toContainHTML(products[2].name);
    });

    await act(async () => {
      await fireEvent.click(screen.getByRole('button', { name: 'Price' }));
    });
    const byPrice = screen.getAllByRole('row').slice(1);
    expect(byPrice).toHaveLength(products.length);
    expect(byPrice[0]).toContainHTML(products[2].name);
    expect(byPrice[1]).toContainHTML(products[1].name);
    expect(byPrice[2]).toContainHTML(products[0].name);

    await act(async () => {
      await fireEvent.click(screen.getByRole('button', { name: 'VAT' }));
    });
    const byVAT = screen.getAllByRole('row').slice(1);
    expect(byVAT).toHaveLength(products.length);
    expect(byVAT[0]).toContainHTML(products[1].name);
    expect(byVAT[1]).toContainHTML(products[0].name);
    expect(byVAT[2]).toContainHTML(products[2].name);

    await act(async () => {
      await userEvent.type(
        screen.getByPlaceholderText('Search'),
        product1.name
      );
    });

    const filtered = screen.getAllByRole('row').slice(1);
    expect(filtered).toHaveLength(1);
  });

  it('redirects to product page clicking edit', async () => {
    server.resetHandlers(mockTrpcQuery('getProducts', [product1]));

    render(<ProductsPage />, { session, router });

    await waitFor(() => {
      const rows = screen.getAllByRole('row').slice(1);
      expect(rows).toHaveLength(1);
      expect(rows[0]).toContainHTML(product1.name);
    });

    await fireEvent.click(await screen.findByRole('link', { name: 'Edit' }));

    expect(mockRouter.push).toHaveBeenCalledWith(
      Routes.product(product1.id),
      expect.anything(),
      expect.anything()
    );
  });

  it('allows the user to delete a product', async () => {
    server.resetHandlers(mockTrpcQuery('getProducts', [product1]));

    render(<ProductsPage />, { session, router });

    await fireEvent.click(
      await screen.findByRole('button', { name: 'Delete' })
    );

    server.resetHandlers(
      mockTrpcMutation('deleteProduct', product1.id),
      mockTrpcQuery('getProducts', [])
    );

    await screen.findByText('Are you sure you want to delete the product?');
    const modalDeleteButton = screen.getAllByRole('button', {
      name: 'Delete',
    })[1];
    await act(async () => {
      await fireEvent.click(modalDeleteButton);
    });

    await screen.findByText('Product deleted');
    expect(screen.queryByText(product1.name)).not.toBeInTheDocument();
  });

  it('handles deletion errors', async () => {
    server.resetHandlers(mockTrpcQuery('getProducts', [product1]));

    render(<ProductsPage />, { session, router });

    await fireEvent.click(
      await screen.findByRole('button', { name: 'Delete' })
    );

    await screen.findByText('Are you sure you want to delete the product?');
    const modalDeleteButton = screen.getAllByRole('button', {
      name: 'Delete',
    })[1];

    server.resetHandlers(
      mockTrpcMutationError(
        'deleteProduct',
        new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      ),
      mockTrpcQuery('getProducts', [product1])
    );

    await act(async () => {
      await fireEvent.click(modalDeleteButton);
    });

    await screen.findByText('Failed to delete product');
    await screen.findByText(product1.name);
  });
});
