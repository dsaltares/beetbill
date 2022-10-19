import 'next';
import { setupServer } from 'msw/node';
import { render, screen, mockRouter, mockSession, waitFor } from '@lib/testing';
import WithAuthentication from './WithAuthentication';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const PageWithAuthentication = WithAuthentication(() => (
  <main>This page requires auth</main>
));

describe('WithAuthentication', () => {
  it('redirects to the login page when the user is not authenticated', async () => {
    const session = undefined;
    server.resetHandlers(mockSession(session));
    render(<PageWithAuthentication />, { session });

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/api/auth/signin');
    });
  });

  it('renders the page when the user is authenticated', async () => {
    const session = {
      user: {},
      userId: 'user_1',
      companyId: 'company_1',
      expires: '',
    };
    server.resetHandlers(mockSession(session));
    render(<PageWithAuthentication />, {
      session,
    });

    await screen.findByText('This page requires auth');
  });
});
