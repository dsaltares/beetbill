import Head from 'next/head';
import {
  faArrowLeft,
  faEnvelopeOpenText,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from '@components/Card';
import AppName from '@lib/appName';
import LinkButton from '@components/LinkButton';
import Routes from '@lib/routes';

const Verify = () => (
  <Card>
    <Head>
      <title>{`Log in - ${AppName}`}</title>
    </Head>
    <div className="flex flex-col gap-8">
      <div className="flex flex-col justify-center gap-3">
        <FontAwesomeIcon
          className="text-4xl text-violet-800"
          icon={faEnvelopeOpenText}
        />
        <h1 className="text-2xl font-bold text-center">Check your email</h1>
      </div>
      <p className="text-base">
        We just emailed you a link that will log you in securely.
      </p>
      <div className="flex w-full justify-center">
        <LinkButton startIcon={faArrowLeft} href={Routes.signIn}>
          Back
        </LinkButton>
      </div>
    </div>
  </Card>
);

export default Verify;
