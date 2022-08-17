import 'next';

import { useSession } from 'next-auth/react';
import { render, screen } from '@lib/testing';
import IndexPage from './index.page';

jest.mock('next-auth/react');

const useSessionFn = useSession as jest.Mock;

describe('IndexPage', () => {
  it('renders correctly', async () => {
    useSessionFn.mockReturnValue({
      status: 'unauthenticated',
      data: null,
    });

    render(<IndexPage />);
    screen.queryByText('Not signed in');
  });
});
