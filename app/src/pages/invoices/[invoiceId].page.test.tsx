import 'next';
import { setupServer } from 'msw/node';
import type { Session } from 'next-auth';
import { TRPCError } from '@trpc/server';
import {
  mockTrpcQuery,
  mockTrpcMutation,
  mockTrpcMutationError,
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
import EditInvoicePage from './[invoiceId].page';

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
  message: '',
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
const invoiceId = 'invoice_1';
const invoice: Invoice = {
  id: invoiceId,
  status: 'DRAFT',
  prefix: '',
  company,
  client,
  date: now,
  message: '',
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
      mockTrpcQuery('getInvoice', invoice),
      mockTrpcQuery('getClients', [client]),
      mockTrpcQuery('getProducts', [product]),
      mockTrpcQuery('getCompany', company),
      mockTrpcQuery('getInvoices', [invoice])
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
      mockTrpcQuery('getInvoice', updatedInvoice),
      mockTrpcQuery('getInvoices', [updatedInvoice])
    );

    await act(async () => {
      await fireEvent.click(
        await screen.findByRole('button', { name: 'Save as draft' })
      );
    });

    await screen.findByText('Successfully updated invoice!');
  });

  it('prevents the user from editing a sent invoice', async () => {
    const sentInvoice = {
      ...invoice,
      status: 'SENT',
      number: 1,
    };
    server.resetHandlers(
      mockTrpcQuery('getInvoice', sentInvoice),
      mockTrpcQuery('getClients', [client]),
      mockTrpcQuery('getProducts', [product]),
      mockTrpcQuery('getCompany', company),
      mockTrpcQuery('getInvoices', [sentInvoice])
    );

    render(<EditInvoicePage />, { session, router });

    expect(await screen.findByPlaceholderText('Prefix...')).toBeDisabled();
    screen
      .queryAllByPlaceholderText('Date...')
      .forEach((element) => expect(element).toBeDisabled());
    expect(screen.queryByRole('button', { name: 'Save as draft' })).toBeNull();
  });

  it('shows a message when failing to update the invoice', async () => {
    server.resetHandlers(
      mockTrpcMutationError(
        'updateInvoice',
        new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      ),
      mockTrpcQuery('getInvoice', invoice),
      mockTrpcQuery('getClients', [client]),
      mockTrpcQuery('getProducts', [product]),
      mockTrpcQuery('getCompany', company),
      mockTrpcQuery('getInvoices', [invoice])
    );

    render(<EditInvoicePage />, { session, router });

    const newPrefix = '2022';
    await fireEvent.change(await screen.findByPlaceholderText('Prefix...'), {
      target: { value: newPrefix },
    });

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
