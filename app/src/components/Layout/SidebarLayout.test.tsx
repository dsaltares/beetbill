import 'next';
import { setupServer } from 'msw/node';
import type { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { render, screen, fireEvent, mockSession } from '@lib/testing';
import Routes from '@lib/routes';
import SidebarLayout from './SidebarLayout';

jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  signOut: jest.fn(),
}));

const server = setupServer();

beforeAll(() => server.listen());
afterAll(() => server.close());

const companyId = 'company_1';
const session: Session = {
  user: {
    email: 'ada.lovelace@company.com',
    name: 'Ada Lovelace',
  },
  userId: 'user_1',
  companyId: companyId,
  expires: '',
};
const router = {
  pathname: Routes.products,
};

describe('SidebarLayout', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    server.resetHandlers(mockSession(session));
  });

  it('allows the user to sign out', async () => {
    render(<SidebarLayout />, { session, router });

    const menuButton = await screen.findByRole('button', {
      name: /Ada Lovelace/,
    });
    await fireEvent.click(menuButton);
    await fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));

    await screen.findByText('Sign out of Beet Bill');
    await fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));

    expect(signOut).toHaveBeenCalled();
  });
});
