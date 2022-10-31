import Head from 'next/head';
import Card from '@components/Card';
import AppName from '@lib/appName';

const Verify = () => (
  <Card>
    <Head>
      <title>{`Log in - ${AppName}`}</title>
    </Head>
    <div className="flex flex-col gap-10">
      <h1 className="text-2xl font-bold text-center">Got it! Email sent</h1>
      <p className="text-base">
        Check your email for a button that will log you in.
      </p>
    </div>
  </Card>
);

export default Verify;
