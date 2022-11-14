import Head from 'next/head';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import AppName from '@lib/appName';
import Button from '@components/Button';
import WithAuthentication from '@components/WithAuthentication';
import Routes from '@lib/routes';
import Card from '@components/Card';

const SignOutPage = () => {
  const router = useRouter();
  return (
    <Card title="Sign out">
      <Head>
        <title>{`Log in - ${AppName}`}</title>
      </Head>
      <p className="text-base text-center">
        Are you sure you want to sign out?
      </p>
      <div className="flex w-full justify-between">
        <Button
          color="secondary"
          startIcon={faArrowLeft}
          onClick={() => router.back()}
        >
          Back
        </Button>
        <Button
          color="danger"
          onClick={() => signOut({ callbackUrl: Routes.home })}
        >
          Sign out
        </Button>
      </div>
    </Card>
  );
};

export default WithAuthentication(SignOutPage);
