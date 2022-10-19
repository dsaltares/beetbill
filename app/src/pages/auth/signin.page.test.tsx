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
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('SignInPage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('displays the providers', async () => {
    server.resetHandlers(mockSession(session));
    render(<SignInPage providers={allProviders} callbackUrl={callbackUrl} />, {
      session,
    });

    await screen.findByRole('button', { name: 'Sign in with Email' });
    await screen.findByRole('button', { name: 'Sign in with Google' });
  });

  it('does not display unavailable providers', async () => {
    server.resetHandlers(mockSession(session));
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
    server.resetHandlers(mockSession(session));
    render(<SignInPage providers={allProviders} callbackUrl={callbackUrl} />, {
      session,
    });

    const button = await screen.findByRole('button', {
      name: 'Sign in with Google',
    });
    await userEvent.click(button);

    expect(signIn).toHaveBeenCalledWith('google', { callbackUrl });
  });

  it('displays an error when trying to sign in with an empty email', async () => {
    server.resetHandlers(mockSession(session));
    render(<SignInPage providers={allProviders} callbackUrl={callbackUrl} />, {
      session,
    });

    const button = await screen.findByRole('button', {
      name: 'Sign in with Email',
    });
    await act(() => userEvent.click(button));

    await screen.findByText('Invalid email address');
    expect(signIn).not.toHaveBeenCalled();
  });

  it('displays an error when entering an invalid email and tabbing', async () => {
    server.resetHandlers(mockSession(session));
    render(<SignInPage providers={allProviders} callbackUrl={callbackUrl} />, {
      session,
    });

    const email = 'invalid-email';
    const emailInput = await screen.findByPlaceholderText('Email address...');
    await userEvent.type(emailInput, email);
    await userEvent.tab();

    await screen.findByDisplayValue(email);

    await screen.findByText('Invalid email address');
    expect(signIn).not.toHaveBeenCalled();
  });

  it('calls signIn with the email provider', async () => {
    server.resetHandlers(mockSession(session));
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
