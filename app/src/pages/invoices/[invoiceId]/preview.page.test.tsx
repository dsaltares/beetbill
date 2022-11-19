import 'next';
import { setupServer } from 'msw/node';
import type { Session } from 'next-auth';
import { TRPCError } from '@trpc/server';
import {
  mockRouter,
  render,
  screen,
  waitFor,
  mockTrpcQuery,
  mockTrpcQueryError,
  mockTrpcMutation,
  fireEvent,
} from '@lib/testing';
import type { Product } from '@server/products/types';
import type { Company } from '@server/company/types';
import type { Client } from '@server/clients/types';
import type { Invoice } from '@server/invoices/types';
import Routes from '@lib/routes';
import downloadInvoice from '@lib/invoices/downloadInvoice';
import PreviewInvoicePage from './preview.page';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

jest.mock('@lib/invoices/downloadInvoice', () => jest.fn());

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
  contactName: 'contact_name',
  vatNumber: 'vat_number',
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
  pathname: '/invoices/[invoiceId]/preview',
  query: { invoiceId },
};

describe('PreviewInvoicePage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders the invoice PDF preview', async () => {
    server.resetHandlers(mockTrpcQuery('getInvoice', invoice));

    render(<PreviewInvoicePage />, { session, router });

    await waitFor(() => {
      expect(
        screen.queryAllByText(invoice.company.name).length
      ).toBeGreaterThanOrEqual(1);
    });
  });

  it('allows the user to send and download the invoice', async () => {
    server.resetHandlers(mockTrpcQuery('getInvoice', invoice));

    render(<PreviewInvoicePage />, { session, router });

    const approveButton = await screen.findByRole('button', {
      name: 'Approve and download',
    });

    const updatedInvoice = {
      ...invoice,
      number: 1,
      status: 'SENT',
    };
    server.resetHandlers(
      mockTrpcMutation('updateInvoice', updatedInvoice),
      mockTrpcQuery('getInvoice', updatedInvoice)
    );

    await fireEvent.click(approveButton);
    await waitFor(() => {
      expect(downloadInvoice).toHaveBeenCalledWith(updatedInvoice);
    });
  });

  it('allows the user to go back to the invoice page', async () => {
    server.resetHandlers(mockTrpcQuery('getInvoice', invoice));

    render(<PreviewInvoicePage />, { session, router });

    await fireEvent.click(await screen.findByRole('link', { name: 'Back' }));

    expect(mockRouter.push).toHaveBeenCalledWith(
      Routes.invoice(invoiceId),
      expect.anything(),
      expect.anything()
    );
  });

  it('redirects to the 404 page when the invoice is not found', async () => {
    server.resetHandlers(
      mockTrpcQueryError('getInvoice', new TRPCError({ code: 'NOT_FOUND' }))
    );

    render(<PreviewInvoicePage />, { session, router });

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(Routes.notFound)
    );
  });
});
