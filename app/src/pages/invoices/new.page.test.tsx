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
  act,
  waitFor,
} from '@lib/testing';
import type { Product } from '@server/products/types';
import type { Company } from '@server/company/types';
import type { Client } from '@server/clients/types';
import type { Invoice } from '@server/invoices/types';
import Routes from '@lib/routes';
import NewInvoicePage from './new.page';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const now = new Date().toISOString();
const companyId = 'company_1';
const userId = 'user_1';
const session: Session = {
  user: {},
  userId,
  companyId: companyId,
  expires: '',
};
const router = {
  pathname: Routes.createProduct,
};
const company: Company = {
  id: companyId,
  name: 'company_name',
  number: 'company_number',
  vatNumber: 'vat_number',
  contactName: 'contact_name',
  email: 'invoicing@company.com',
  website: 'https://company.com',
  country: 'United Kingdom',
  address: 'Oxford Street',
  city: 'London',
  postCode: 'W1',
  iban: 'GB33BUKB20201555555555',
  userId,
  createdAt: now,
};
const product: Product = {
  id: 'product_id',
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

describe('NewInvoicePage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('tells the user they need to complete company details when the company is incomplete', async () => {
    const incompleteCompany: Company = {
      id: companyId,
      name: '',
      number: '',
      vatNumber: '',
      contactName: '',
      email: '',
      website: '',
      country: '',
      address: '',
      city: '',
      postCode: '',
      iban: '',
      userId: 'user_id',
      createdAt: now,
    };
    server.resetHandlers(
      mockTrpcQuery('getClients', []),
      mockTrpcQuery('getProducts', []),
      mockTrpcQuery('getCompany', incompleteCompany),
      mockTrpcQuery('getInvoices', [])
    );

    render(<NewInvoicePage />, { session, router });

    await fireEvent.click(
      await screen.findByRole('link', { name: 'Add company details' })
    );
    expect(mockRouter.push).toHaveBeenCalledWith(
      Routes.company,
      expect.anything(),
      expect.anything()
    );
  });

  it('tells they user they need to create a client if there are no clients', async () => {
    server.resetHandlers(
      mockTrpcQuery('getClients', []),
      mockTrpcQuery('getProducts', [product]),
      mockTrpcQuery('getCompany', company),
      mockTrpcQuery('getInvoices', [])
    );

    render(<NewInvoicePage />, { session, router });

    await fireEvent.click(
      await screen.findByRole('link', { name: 'Add clients' })
    );
    expect(mockRouter.push).toHaveBeenCalledWith(
      Routes.createClient,
      expect.anything(),
      expect.anything()
    );
  });

  it('tells they user they need to create a product if there are no products', async () => {
    server.resetHandlers(
      mockTrpcQuery('getClients', [client]),
      mockTrpcQuery('getProducts', []),
      mockTrpcQuery('getCompany', company),
      mockTrpcQuery('getInvoices', [])
    );

    render(<NewInvoicePage />, { session, router });

    await fireEvent.click(
      await screen.findByRole('link', { name: 'Add products' })
    );
    expect(mockRouter.push).toHaveBeenCalledWith(
      Routes.createProduct,
      expect.anything(),
      expect.anything()
    );
  });

  it('allows the user to create an invoice', async () => {
    server.resetHandlers(
      mockTrpcQuery('getClients', [client]),
      mockTrpcQuery('getProducts', [product]),
      mockTrpcQuery('getCompany', company),
      mockTrpcQuery('getInvoices', [])
    );

    render(<NewInvoicePage />, { session, router });

    await fireEvent.click(await screen.findByPlaceholderText('Client...'));
    await fireEvent.click(await screen.findByText(client.name));
    await fireEvent.click(await screen.findByPlaceholderText('Product...'));
    await act(async () => {
      await fireEvent.click(await screen.findByText(product.name));
    });

    const invoice: Invoice = {
      id: 'invoice_1',
      status: 'DRAFT',
      prefix: '',
      company,
      client,
      date: now,
      items: [
        {
          id: 'item_1',
          invoiceId: 'invoice_1',
          product,
          quantity: 1,
          date: now,
          createdAt: now,
          updatedAt: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };
    server.resetHandlers(
      mockTrpcMutation('createInvoice', invoice),
      mockTrpcQuery('getInvoices', [invoice])
    );

    const saveButton = await screen.findByRole('button', {
      name: 'Save as draft',
    });
    await act(async () => {
      await fireEvent.click(saveButton);
    });

    await waitFor(() => {
      screen.getByText('Successfully created invoice!');
      expect(mockRouter.push).toHaveBeenCalledWith(Routes.invoice(invoice.id));
    });
  });

  it('shows a message when failing to create an invoice', async () => {
    server.resetHandlers(
      mockTrpcMutationError(
        'createInvoice',
        new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      ),
      mockTrpcQuery('getClients', [client]),
      mockTrpcQuery('getProducts', [product]),
      mockTrpcQuery('getCompany', company),
      mockTrpcQuery('getInvoices', [])
    );

    render(<NewInvoicePage />, { session, router });

    await fireEvent.click(await screen.findByPlaceholderText('Client...'));
    await fireEvent.click(await screen.findByText(client.name));
    await fireEvent.click(await screen.findByPlaceholderText('Product...'));
    await act(async () => {
      await fireEvent.click(await screen.findByText(product.name));
    });

    const saveButton = await screen.findByRole('button', {
      name: 'Save as draft',
    });

    await act(async () => {
      await fireEvent.click(saveButton);
    });

    await screen.findByText('Failed to create invoice');
  });
});
