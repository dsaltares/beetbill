import Head from 'next/head';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import AppName from '@lib/appName';
import LinkButton from '@components/LinkButton';
import Routes from '@lib/routes';
import WithNoAuthentication from '@components/WithNoAuthentication';
import Card from '@components/Card';

const VerifyPage = () => (
  <Card title="Check your email">
    <Head>
      <title>{`Log in - ${AppName}`}</title>
    </Head>
    <p className="text-base text-center">
      We just emailed you a link that will log you in securely.
    </p>
    <div className="flex w-full justify-center">
      <LinkButton startIcon={faArrowLeft} href={Routes.signIn}>
        Back
      </LinkButton>
    </div>
  </Card>
);

export default WithNoAuthentication(VerifyPage);
