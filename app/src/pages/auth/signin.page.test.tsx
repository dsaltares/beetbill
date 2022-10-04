import 'next';
import { signIn, useSession, type ClientSafeProvider } from 'next-auth/react';
import type { ProviderType } from 'next-auth/providers';
import userEvent from '@testing-library/user-event';
import { screen, render, act } from '@lib/testing';
import SignInPage from './signin.page';

jest.mock('next-auth/react');

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
const useSessionMock = useSession as jest.MockedFunction<typeof useSession>;

describe('SignInPage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    useSessionMock.mockReturnValue({ status: 'unauthenticated', data: null });
  });

  it('displays the providers', async () => {
    render(<SignInPage providers={allProviders} callbackUrl={callbackUrl} />, {
      session: null,
    });

    screen.getByRole('button', { name: 'Sign in with Email' });
    screen.getByRole('button', { name: 'Sign in with Google' });
  });

  it('does not display unavailable providers', async () => {
    render(
      <SignInPage
        providers={{ email: emailProvider }}
        callbackUrl={callbackUrl}
      />
    );

    screen.getByRole('button', { name: 'Sign in with Email' });
    expect(screen.queryByText('Sign in with Google')).not.toBeInTheDocument();
  });

  it('calls signIn with the right provider when trying to log in', async () => {
    render(<SignInPage providers={allProviders} callbackUrl={callbackUrl} />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Sign in with Google' })
    );

    expect(signIn).toHaveBeenCalledWith('google', { callbackUrl });
  });

  it('displays an error when trying to sign in with an empty email', async () => {
    render(<SignInPage providers={allProviders} callbackUrl={callbackUrl} />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Sign in with Email' })
    );

    await screen.findByText('Invalid email address');
    expect(signIn).not.toHaveBeenCalled();
  });

  it('displays an error when trying to sign in with an invalid email', async () => {
    render(<SignInPage providers={allProviders} callbackUrl={callbackUrl} />);

    const email = 'invalid-email';
    const emailInput = screen.getByPlaceholderText('Email address...');
    await userEvent.type(emailInput, email);
    await screen.findByDisplayValue(email);
    await userEvent.click(
      screen.getByRole('button', { name: 'Sign in with Email' })
    );

    await screen.findByText('Invalid email address');
    expect(signIn).not.toHaveBeenCalled();
  });

  it('calls signIn with the email provider', async () => {
    render(<SignInPage providers={allProviders} callbackUrl={callbackUrl} />);

    const email = 'ada@lovelace.com';

    const emailInput = screen.getByPlaceholderText('Email address...');

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
