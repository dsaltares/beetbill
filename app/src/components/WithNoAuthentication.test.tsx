import 'next';
import { setupServer } from 'msw/node';
import { render, screen, mockRouter, mockSession, waitFor } from '@lib/testing';
import WithNoAuthentication from './WithNoAuthentication';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const PageWithNoAuthentication = WithNoAuthentication(() => (
  <main>This page requires an unauthenticated user</main>
));

describe('WithAuthentication', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders the page when the user is not authenticated', async () => {
    const session = undefined;
    server.resetHandlers(mockSession(session));
    render(<PageWithNoAuthentication />, { session });

    await screen.findByText('This page requires an unauthenticated user');
  });

  it('redirects to the home page when the user is authenticated', async () => {
    const session = {
      user: {},
      userId: 'user_1',
      companyId: 'company_1',
      expires: '',
    };
    server.resetHandlers(mockSession(session));
    render(<PageWithNoAuthentication />, { session });

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });
});
