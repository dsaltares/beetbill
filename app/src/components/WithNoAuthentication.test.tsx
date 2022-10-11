import 'next';
import { useSession } from 'next-auth/react';
import { render, screen, mockRouter } from '@lib/testing';
import WithNoAuthentication from './WithNoAuthentication';

jest.mock('next-auth/react');

const useSessionMock = useSession as jest.MockedFunction<typeof useSession>;
const PageWithNoAuthentication = WithNoAuthentication(() => (
  <main>This page requires an unauthenticated user</main>
));

describe('WithAuthentication', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders nothing when still loading', async () => {
    useSessionMock.mockReturnValueOnce({ status: 'loading', data: null });
    render(<PageWithNoAuthentication />);
  });

  it('renders the page when the user is not authenticated', async () => {
    useSessionMock.mockReturnValueOnce({
      status: 'unauthenticated',
      data: null,
    });
    render(<PageWithNoAuthentication />);

    screen.getByText('This page requires an unauthenticated user');
  });

  it('redirects to the home page when the user is authenticated', async () => {
    useSessionMock.mockReturnValueOnce({
      status: 'authenticated',
      data: { user: {}, userId: 'user_1', companyId: 'company_1', expires: '' },
    });
    render(<PageWithNoAuthentication />);

    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });
});
