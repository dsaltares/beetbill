import type { ClientSafeProvider } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import { useMemo } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import capitalizeFirstLetter from '@lib/capitalizeFirstLetter';
import EmailRegexp from '@lib/emailRegexp';
import Button from './Button';
import GoogleIcon from './Icons/GoogleIcon';
import type { Icon } from './Icons/types';
import TextField from './TextField';
import Card from './Card';

type SignInFormProps = {
  providers: Record<string, ClientSafeProvider>;
  callbackUrl?: string;
  error?: string;
};

const ProviderIcons: Record<string, Icon> = {
  google: GoogleIcon,
};

const SignInForm = ({ providers, callbackUrl, error }: SignInFormProps) => {
  const hasEmail = useMemo(() => !!providers['email'], [providers]);
  const nonEmailProviders = useMemo(
    () => Object.keys(providers).filter((provider) => provider !== 'email'),
    [providers]
  );
  const hasOtherProviders = nonEmailProviders.length > 0;
  const hasOauthAndEmail = hasEmail && nonEmailProviders.length > 0;

  return (
    <Card>
      <h1 className="text-2xl font-bold text-center">Sign in to Invoicing</h1>
      <ErrorAlert error={error} />
      {hasOtherProviders && (
        <div className="flex flex-col gap-2">
          {nonEmailProviders.map((provider) => (
            <Button
              key={provider}
              startIcon={ProviderIcons[provider]}
              onClick={() => signIn(provider, { callbackUrl })}
              color="secondary"
              variant="outlined"
            >{`Sign in with ${capitalizeFirstLetter(provider)}`}</Button>
          ))}
        </div>
      )}
      {hasOauthAndEmail && (
        <div className="flex items-center">
          <div className="flex-grow h-px bg-gray-400"></div>
          <span className="flex-shrink text-sm text-gray-500 px-4">or</span>
          <div className="flex-grow h-px bg-gray-400"></div>
        </div>
      )}
      {hasEmail && <EmailForm callbackUrl={callbackUrl} />}
    </Card>
  );
};

type EmailFormValues = {
  email: string;
};

type EmailFormProps = {
  callbackUrl?: string;
};

const EmailForm = ({ callbackUrl }: EmailFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormValues>({ mode: 'onBlur' });
  const onSubmit: SubmitHandler<EmailFormValues> = ({ email }) =>
    signIn('email', { email, callbackUrl });

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        id="signin-email"
        placeholder="Email address..."
        type="text"
        {...register('email', {
          pattern: EmailRegexp,
          required: true,
        })}
        error={errors.email && 'Invalid email address'}
      />
      <Button type="submit" endIcon={faEnvelope} fullWidth>
        Sign in with Email
      </Button>
    </form>
  );
};

// Default list of messages
// Documentation: https://next-auth.js.org/configuration/pages#error-codes
// Example: https://github.com/nextauthjs/next-auth/blob/82447f8e3ebc7004cf91121725b4f5970d2276d8/src/core/pages/signin.tsx#L42
const ErrorMessages: Record<string, string> = {
  Signin: 'Try signing in with a different account.',
  OAuthSignin: 'Try signing in with a different account.',
  OAuthCallback: 'Try signing in with a different account.',
  OAuthCreateAccount: 'Try signing in with a different account.',
  EmailCreateAccount: 'Try signing in with a different account.',
  Callback: 'Try signing in with a different account.',
  OAuthAccountNotLinked:
    'To confirm your identity, sign in with the same account you used originally.',
  EmailSignin: 'The e-mail could not be sent.',
  CredentialsSignin:
    'Sign in failed. Check the details you provided are correct.',
  SessionRequired: 'Please sign in to access this page.',
  default: 'Unable to sign in.',
};

type ErrorAlertProps = {
  error?: string;
};

const ErrorAlert = ({ error }: ErrorAlertProps) =>
  error ? (
    <div className="max-w-prose rounded-md bg-red-200 p-2 text-black">
      {ErrorMessages[error] || ErrorMessages['default']}
    </div>
  ) : null;

export default SignInForm;
