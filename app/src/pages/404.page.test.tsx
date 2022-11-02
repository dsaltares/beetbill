import 'next';
import { setupServer } from 'msw/node';
import { screen, render, mockSession } from '@lib/testing';
import NotFoundPage from './404.page';

const session = undefined;
const server = setupServer();

beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers(mockSession(session)));
afterAll(() => server.close());

describe('NotFoundPage', () => {
  it('renders the page', async () => {
    render(<NotFoundPage />, { session });

    await screen.findByRole('link', { name: 'Home' });
  });
});
