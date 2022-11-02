import 'next';
import { setupServer } from 'msw/node';
import { screen, render, mockSession } from '@lib/testing';
import VerifyPage from './verify.page';

const session = undefined;
const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('VerifyPage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    server.resetHandlers(mockSession(session));
  });

  it('renders the page', async () => {
    render(<VerifyPage />, { session });

    await screen.findByRole('link', { name: 'Back' });
  });
});
