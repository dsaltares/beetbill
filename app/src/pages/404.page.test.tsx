import 'next';
import { screen, render } from '@lib/testing';
import NotFoundPage from './404.page';

describe('NotFoundPage', () => {
  it('renders the page', async () => {
    render(<NotFoundPage />);

    await screen.findByRole('link', { name: 'Home' });
  });
});
