import 'next';
import { signIn, type ClientSafeProvider } from 'next-auth/react';
import type { ProviderType } from 'next-auth/providers';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { screen, render, act, mockSession } from '@lib/testing';
import SignInPage from './signin.page';

jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  signIn: jest.fn(),
}));

const server = setupServer();

const googleProvider: ClientSafeProvider = {
  id: 'google',
  name: 'Google',
  type: 'google' as ProviderType,
  signinUrl: '/api/auth/google',
  callbackUrl: '/api/auth/callback/google',
};

const emailProvider: ClientSafeProvider = {
  id: 'email',
  name: 'Email',
  type: 'email' as ProviderType,
  signinUrl: '/api/auth/email',
  callbackUrl: '/api/auth/callback/email',
};

const allProviders = {
  google: googleProvider,
  email: emailProvider,
};

const callbackUrl = '/';
const session = undefined;

beforeAll(() => server.listen());
afterAll(() => server.close());

describe('SignInPage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    server.resetHandlers(mockSession(session));
  });

  it('displays the providers', async () => {
    render(<SignInPage providers={allProviders} callbackUrl={callbackUrl} />, {
      session,
    });

    await screen.findByRole('button', { name: 'Sign in with Email' });
    await screen.findByRole('button', { name: 'Sign in with Google' });
  });

  it('does not display unavailable providers', async () => {
    render(
      <SignInPage
        providers={{ email: emailProvider }}
        callbackUrl={callbackUrl}
      />,
      { session }
    );

    await screen.findByRole('button', { name: 'Sign in with Email' });
    expect(screen.queryByText('Sign in with Google')).not.toBeInTheDocument();
  });

  it('calls signIn with the right provider when trying to log in', async () => {
    render(<SignInPage providers={allProviders} callbackUrl={callbackUrl} />, {
      session,
    });

    const button = await screen.findByRole('button', {
      name: 'Sign in with Google',
    });
    await userEvent.click(button);

    expect(signIn).toHaveBeenCalledWith('google', { callbackUrl });
  });

  it('calls signIn with the email provider', async () => {
    render(<SignInPage providers={allProviders} callbackUrl={callbackUrl} />, {
      session,
    });

    const email = 'ada@lovelace.com';

    const emailInput = await screen.findByPlaceholderText('Email address...');

    await act(async () => userEvent.type(emailInput, `${email}{enter}`));
    await screen.findByDisplayValue(email);
    await act(async () =>
      userEvent.click(
        screen.getByRole('button', { name: 'Sign in with Email' })
      )
    );

    expect(signIn).toHaveBeenCalledWith('email', {
      email,
      callbackUrl,
    });
  });
});
