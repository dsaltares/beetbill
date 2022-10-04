import 'next';
import { useSession } from 'next-auth/react';
import { render, screen, mockRouter } from '@lib/testing';
import WithAuthentication from './WithAuthentication';

jest.mock('next-auth/react');

const useSessionMock = useSession as jest.MockedFunction<typeof useSession>;
const PageWithAuthentication = WithAuthentication(() => (
  <main>This page requires auth</main>
));

describe('WithAuthentication', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders spinner when still loading', async () => {
    useSessionMock.mockReturnValueOnce({ status: 'loading', data: null });
    render(<PageWithAuthentication />);

    screen.getByText('Loading...');
  });

  it('redirects to the login page when the user is not authenticated', async () => {
    useSessionMock.mockReturnValueOnce({
      status: 'unauthenticated',
      data: null,
    });
    render(<PageWithAuthentication />);

    expect(mockRouter.push).toHaveBeenCalledWith('/api/auth/signin');
  });

  it('renders the page when the user is authenticated', async () => {
    useSessionMock.mockReturnValueOnce({
      status: 'authenticated',
      data: { user: {}, userId: 'user_1', companyId: 'company_1', expires: '' },
    });
    render(<PageWithAuthentication />);

    screen.getByText('This page requires auth');
  });
});
