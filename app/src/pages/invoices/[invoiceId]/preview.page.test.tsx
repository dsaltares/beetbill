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
} from '@lib/testing';
import type { Product } from '@server/products/types';
import type { Company } from '@server/company/types';
import type { Client } from '@server/clients/types';
import type { Invoice } from '@server/invoices/types';
import Routes from '@lib/routes';
import PreviewInvoicePage from './preview.page';

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
