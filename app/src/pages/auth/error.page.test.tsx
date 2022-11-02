import 'next';
import { setupServer } from 'msw/node';
import { screen, render, mockSession } from '@lib/testing';
import ErrorPage from './error.page';

const session = undefined;
const server = setupServer();

beforeAll(() => server.listen());
afterAll(() => server.close());

describe('ErrorPage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    server.resetHandlers(mockSession(session));
  });

  it('renders the page and shows the correct error message', async () => {
    render(<ErrorPage error="Verification" />, { session });

    await screen.findByRole('link', { name: 'Sign in' });
    await screen.findByText(
      'The sign in link is no longer valid. It may have been used or it may have expired.'
    );
  });
});
