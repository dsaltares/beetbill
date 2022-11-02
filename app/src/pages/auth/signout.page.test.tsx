import 'next';
import { setupServer } from 'msw/node';
import { signOut } from 'next-auth/react';
import { screen, render, mockSession, fireEvent, waitFor } from '@lib/testing';
import Routes from '@lib/routes';
import SignOutPage from './signout.page';

jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  signOut: jest.fn(),
}));

const session = {
  user: {},
  userId: 'user_1',
  companyId: 'company_1',
  expires: '',
};
const server = setupServer();

beforeAll(() => server.listen());
afterAll(() => server.close());

describe('SignOutPage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    server.resetHandlers(mockSession(session));
  });

  it('signs out the user when they confirm', async () => {
    render(<SignOutPage />, { session });

    await fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledWith({ callbackUrl: Routes.home });
    });
  });
});
