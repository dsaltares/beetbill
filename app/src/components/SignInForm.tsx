import type { ClientSafeProvider } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import { useMemo } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import capitalizeFirstLetter from '@lib/capitalizeFirstLetter';
import Button from './Button';
import GoogleIcon from './Icons/GoogleIcon';
import type { Icon } from './Icons/types';
import Input from './Input';

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
    <div className="flex flex-col p-8 shadow-[0_-12px_50px_0px_rgb(0,0,0,0.25)] md:shadow-2xl rounded-t-xl md:rounded-xl w-full max-w-[402px] gap-10">
      <ErrorAlert error={error} />
      <h1 className="text-2xl font-bold text-center">Sign in to Invoicing</h1>
      {hasOtherProviders && (
        <div className="flex flex-col gap-2">
          {nonEmailProviders.map((provider) => (
            <Button
              key={provider}
              startIcon={ProviderIcons[provider]}
              onClick={() => signIn(provider, { callbackUrl })}
              variant="secondary"
              mode="borderless"
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
    </div>
  );
};

const EmailRegexp =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
      <Input
        placeholder="Email address..."
        {...register('email', {
          pattern: EmailRegexp,
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
    <div className="my-4 max-w-prose rounded-md bg-red-200 p-2 text-black">
      {ErrorMessages[error] || ErrorMessages['default']}
    </div>
  ) : null;

export default SignInForm;