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
import type { Invoice } from '@server/invoices/types';
import type { Company } from '@server/company/types';
import type { Client } from '@server/clients/types';
import type { Product } from '@server/products/types';
import InvoicesPage from './invoices.page';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const now = new Date().toISOString();
const userId = 'user_1';
const companyId = 'company_1';
const session: Session = {
  user: {},
  userId,
  companyId,
  expires: '',
};
const router = {
  pathname: '/invoices',
};
const company: Company = {
  id: companyId,
  name: 'Company',
  number: '1',
  vatNumber: '123456789',
  userId: userId,
  createdAt: now,
  email: null,
  website: null,
  address: null,
  country: null,
  city: null,
  postCode: null,
  iban: null,
};
const client: Client = {
  id: 'client_1',
  name: 'Lovelace',
  number: '2',
  vatNumber: '987654321',
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@lovelace.com',
  address: null,
  country: null,
  city: null,
  postCode: null,
  paymentTerms: 7,
  createdAt: now,
  updatedAt: now,
  companyId,
};
const product: Product = {
  id: 'product_1',
  name: 'Product 1',
  includesVat: false,
  price: 2,
  currency: 'EUR',
  vat: 0,
  unit: 'h',
  companyId,
  createdAt: now,
  updatedAt: now,
};
const invoice1: Invoice = {
  id: 'invoice_1',
  status: 'DRAFT',
  prefix: '2022',
  number: null,
  date: now,
  createdAt: now,
  updatedAt: now,
  company,
  client,
  items: [
    {
      id: 'item_1',
      invoiceId: 'invoice_1',
      date: now,
      createdAt: now,
      updatedAt: now,
      quantity: 2,
      product,
    },
  ],
};
const invoice2: Invoice = {
  id: 'invoice_2',
  status: 'SENT',
  prefix: '2022',
  number: null,
  date: now,
  createdAt: now,
  updatedAt: now,
  company,
  client,
  items: [
    {
      id: 'item_1',
      invoiceId: 'invoice_2',
      date: now,
      createdAt: now,
      updatedAt: now,
      quantity: 5,
      product,
    },
  ],
};
const invoice3: Invoice = {
  id: 'invoice_3',
  status: 'PAID',
  prefix: '2022',
  number: null,
  date: now,
  createdAt: now,
  updatedAt: now,
  company,
  client,
  items: [
    {
      id: 'item_1',
      invoiceId: 'invoice_3',
      date: now,
      createdAt: now,
      updatedAt: now,
      quantity: 3,
      product,
    },
  ],
};
const invoices: Invoice[] = [invoice1, invoice2, invoice3];

describe('InvoicesPage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders empty screen when there are no invoices', async () => {
    server.resetHandlers(mockTrpcQuery('getInvoices', []));

    render(<InvoicesPage />, { session, router });

    await screen.findByText("You don't have any invoices yet");
    await fireEvent.click(
      await screen.findByRole('link', { name: 'Add invoice' })
    );

    expect(mockRouter.push).toHaveBeenCalledWith(
      Routes.createInvoice,
      expect.anything(),
      expect.anything()
    );
  });

  it('renders the list of invoices, can sort and can filter', async () => {
    server.resetHandlers(mockTrpcQuery('getInvoices', invoices));

    render(<InvoicesPage />, { session, router });

    await waitFor(() => {
      const rows = screen.getAllByRole('row').slice(1);
      expect(rows).toHaveLength(invoices.length);
      expect(rows[0]).toContainHTML('Draft');
      expect(rows[1]).toContainHTML('Sent');
      expect(rows[2]).toContainHTML('Paid');
    });

    await act(async () => {
      await fireEvent.click(screen.getByRole('button', { name: 'Total' }));
    });
    const byPrice = screen.getAllByRole('row').slice(1);
    expect(byPrice).toHaveLength(invoices.length);
    expect(byPrice[0]).toContainHTML('10.00 EUR');
    expect(byPrice[1]).toContainHTML('6.00 EUR');
    expect(byPrice[2]).toContainHTML('4.00 EUR');
  });

  it('redirects to invoice page clicking edit', async () => {
    server.resetHandlers(mockTrpcQuery('getInvoices', [invoice1]));

    render(<InvoicesPage />, { session, router });

    await fireEvent.click(await screen.findByRole('link', { name: 'Edit' }));

    expect(mockRouter.push).toHaveBeenCalledWith(
      Routes.invoice(invoice1.id),
      expect.anything(),
      expect.anything()
    );
  });

  it('allows the user to delete an invoice', async () => {
    server.resetHandlers(mockTrpcQuery('getInvoices', [invoice1]));

    render(<InvoicesPage />, { session, router });

    await screen.findByText(client.name);
    await fireEvent.click(
      await screen.findByRole('button', { name: 'Delete' })
    );

    server.resetHandlers(
      mockTrpcMutation('deleteInvoice', invoice1.id),
      mockTrpcQuery('getInvoices', [])
    );

    await screen.findByText('Are you sure you want to delete the invoice?');
    const modalDeleteButton = screen.getAllByRole('button', {
      name: 'Delete',
    })[1];
    await act(async () => {
      await fireEvent.click(modalDeleteButton);
    });

    await screen.findByText('Invoice deleted');
    expect(screen.queryByText(client.name)).not.toBeInTheDocument();
  });

  it('handles deletion errors', async () => {
    server.resetHandlers(mockTrpcQuery('getInvoices', [invoice1]));

    render(<InvoicesPage />, { session, router });

    await fireEvent.click(
      await screen.findByRole('button', { name: 'Delete' })
    );

    await screen.findByText('Are you sure you want to delete the invoice?');
    const modalDeleteButton = screen.getAllByRole('button', {
      name: 'Delete',
    })[1];

    server.resetHandlers(
      mockTrpcMutationError(
        'deleteInvoice',
        new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      ),
      mockTrpcQuery('getInvoices', [invoice1])
    );

    await act(async () => {
      await fireEvent.click(modalDeleteButton);
    });

    await screen.findByText('Failed to delete invoice');
    await screen.findByText(client.name);
  });
});
