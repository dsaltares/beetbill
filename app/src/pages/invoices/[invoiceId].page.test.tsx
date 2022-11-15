import 'next';
import { setupServer } from 'msw/node';
import type { Session } from 'next-auth';
import { TRPCError } from '@trpc/server';
import {
  mockRouter,
  mockTrpcMutation,
  mockTrpcMutationError,
  render,
  screen,
  fireEvent,
  mockTrpcQueries,
  act,
  waitFor,
} from '@lib/testing';
import type { Product } from '@server/products/types';
import type { Company } from '@server/company/types';
import type { Client } from '@server/clients/types';
import type { Invoice } from '@server/invoices/types';
import Routes from '@lib/routes';
import EditInvoicePage from './[invoiceId].page';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const companyId = 'company_1';
const userId = 'user_1';
const session: Session = {
  user: {},
  userId,
  companyId: companyId,
  expires: '',
};
const company: Company = {
  id: companyId,
  name: 'company_name',
  number: 'company_number',
  vatNumber: 'vat_number',
  email: 'invoicing@company.com',
  website: 'https://company.com',
  country: 'United Kingdom',
  address: 'Oxford Street',
  city: 'London',
  postCode: 'W1',
  iban: 'GB33BUKB20201555555555',
  userId,
  createdAt: new Date(),
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
  createdAt: new Date(),
  updatedAt: new Date(),
};
const client: Client = {
  id: 'client_1',
  name: 'Client 1',
  number: '1',
  vatNumber: '1',
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@company.com',
  country: 'client_country',
  address: 'client_address',
  postCode: 'client_post_code',
  city: 'client_city',
  paymentTerms: 7,
  companyId,
  createdAt: new Date(),
  updatedAt: new Date(),
};
const invoiceId = 'invoice_1';
const invoice: Invoice = {
  id: invoiceId,
  status: 'DRAFT',
  prefix: '',
  company,
  client,
  date: new Date().toISOString(),
  items: [
    {
      id: 'item_1',
      invoiceId: 'invoice_1',
      product,
      quantity: 1,
      date: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};
const router = {
  pathname: '/invoices/[invoiceId]',
  query: { invoiceId },
};

describe('EditInvoicePage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('allows the user to edit the invoice', async () => {
    server.resetHandlers(
      mockTrpcQueries([
        { name: 'getInvoice', result: invoice },
        { name: 'getClients', result: [client] },
        { name: 'getProducts', result: [product] },
        { name: 'getCompany', result: company },
        { name: 'getInvoices', result: [invoice] },
      ])
    );

    render(<EditInvoicePage />, { session, router });

    const newPrefix = '2022';
    await fireEvent.change(await screen.findByPlaceholderText('Prefix...'), {
      target: { value: newPrefix },
    });

    const updatedInvoice = {
      ...invoice,
      prefix: newPrefix,
    };
    server.resetHandlers(
      mockTrpcMutation('updateInvoice', updatedInvoice),
      mockTrpcQueries([
        { name: 'getInvoice', result: updatedInvoice },
        { name: 'getInvoices', result: [updatedInvoice] },
      ])
    );

    await act(async () => {
      await fireEvent.click(
        await screen.findByRole('button', { name: 'Save as draft' })
      );
    });

    await waitFor(() => {
      screen.getByText('Invoice updated');
      expect(mockRouter.push).toHaveBeenCalledWith(Routes.invoices);
    });
  });

  it('shows a message when failing to update the invoice', async () => {
    server.resetHandlers(
      mockTrpcQueries([
        { name: 'getInvoice', result: invoice },
        { name: 'getClients', result: [client] },
        { name: 'getProducts', result: [product] },
        { name: 'getCompany', result: company },
        { name: 'getInvoices', result: [invoice] },
      ])
    );

    render(<EditInvoicePage />, { session, router });

    const newPrefix = '2022';
    await fireEvent.change(await screen.findByPlaceholderText('Prefix...'), {
      target: { value: newPrefix },
    });

    server.resetHandlers(
      mockTrpcMutationError(
        'updateInvoice',
        new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      ),
      mockTrpcQueries([
        { name: 'getInvoice', result: invoice },
        { name: 'getInvoices', result: [invoice] },
      ])
    );

    await act(async () => {
      await fireEvent.click(
        await screen.findByRole('button', { name: 'Save as draft' })
      );
    });

    await waitFor(() => {
      screen.getByText('Failed to update invoice');
    });
  });
});
