import 'next';
import { setupServer } from 'msw/node';
import type { Session } from 'next-auth';
import userEvent from '@testing-library/user-event';
import { TRPCError } from '@trpc/server';
import {
  act,
  mockTrpcMutation,
  mockTrpcMutationError,
  mockTrpcQuery,
  render,
  screen,
} from '@lib/testing';
import type { Company } from '@server/company/types';
import CompanyPage from './company.page';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const company: Company = {
  id: 'company_id',
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
  userId: 'user_id',
  createdAt: new Date(),
};

const session: Session = {
  user: {},
  userId: 'user_1',
  companyId: 'company_1',
  expires: '',
};
const router = {
  pathname: '/company',
};

describe('CompanyPage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('shows existing company details in form', async () => {
    server.resetHandlers(mockTrpcQuery('getCompany', company));

    render(<CompanyPage />, { session, router });

    await screen.findByDisplayValue(company.name);
    await screen.findByDisplayValue(company.number);
    await screen.findByDisplayValue(company.vatNumber!);
    await screen.findByDisplayValue(company.email!);
    await screen.findByDisplayValue(company.website!);
    await screen.findByDisplayValue(company.country!);
    await screen.findByDisplayValue(company.address!);
    await screen.findByDisplayValue(company.city!);
    await screen.findByDisplayValue(company.postCode!);
    await screen.findByDisplayValue(company.iban!);
  });

  it('allows the user to update company details', async () => {
    server.resetHandlers(mockTrpcQuery('getCompany', company));

    render(<CompanyPage />, { session, router });

    const nameField = await screen.findByDisplayValue(company.name);

    const newName = 'new company name';
    const updatedCompany = { ...company, name: newName };
    server.resetHandlers(
      mockTrpcMutation('updateCompany', updatedCompany),
      mockTrpcQuery('getCompany', updatedCompany)
    );

    await userEvent.clear(nameField);
    await userEvent.type(nameField, newName);

    await act(async () =>
      userEvent.click(screen.getByRole('button', { name: 'Save' }))
    );

    await screen.findByText('Successfully updated company!');
  });

  it('shows toast when failing to update company details', async () => {
    server.resetHandlers(mockTrpcQuery('getCompany', company));

    render(<CompanyPage />, { session, router });

    const nameField = await screen.findByDisplayValue(company.name);

    server.resetHandlers(
      mockTrpcMutationError(
        'updateCompany',
        new TRPCError({ code: 'NOT_FOUND' })
      ),
      mockTrpcQuery('getCompany', company)
    );

    const newName = 'new company name';
    await userEvent.clear(nameField);
    await userEvent.type(nameField, newName);

    await act(async () =>
      userEvent.click(screen.getByRole('button', { name: 'Save' }))
    );

    await screen.findByText('Failed to update company');
  });

  it('shows error when trying to remove the company number', async () => {
    server.resetHandlers(mockTrpcQuery('getCompany', company));

    render(<CompanyPage />, { session, router });

    const numberField = await screen.findByDisplayValue(company.number);
    await userEvent.clear(numberField);

    await act(async () =>
      userEvent.click(screen.getByRole('button', { name: 'Save' }))
    );

    await screen.findByText('Registration number is required');
  });
});
