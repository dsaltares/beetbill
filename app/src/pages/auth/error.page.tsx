import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import {
  faArrowRight,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LinkButton from '@components/LinkButton';
import AppName from '@lib/appName';
import Routes from '@lib/routes';
import WithNoAuthentication from '@components/WithNoAuthentication';
import CardWithLogo from '@components/CardWithLogo';

const Messages: Record<string, string> = {
  Configuration: 'The application is misconfigured, please contact support.',
  AccessDenied: 'Your account has been blocked, please contact support.',
  Verification:
    'The sign in link is no longer valid. It may have been used or it may have expired.',
  Default: 'Something went wrong, please try again.',
};

const ErrorPage = ({
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const message = Messages[error] || Messages.Default;
  return (
    <CardWithLogo>
      <Head>
        <title>{`Log in - ${AppName}`}</title>
      </Head>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col justify-center gap-3">
          <FontAwesomeIcon
            className="text-4xl text-violet-800 "
            icon={faTriangleExclamation}
          />
          <h1 className="text-2xl font-bold text-center">Unable to sign in</h1>
        </div>
        <p className="text-base">{message}</p>
        <div className="flex w-full justify-center">
          <LinkButton endIcon={faArrowRight} href={Routes.signIn}>
            Sign in
          </LinkButton>
        </div>
      </div>
    </CardWithLogo>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => ({
  props: {
    error: context.query.error || '',
  },
});

export default WithNoAuthentication(ErrorPage);
