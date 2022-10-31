import '../styles/globals.css';

import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import type { AppProps as BaseAppProps } from 'next/app';
import type { Session } from 'next-auth';
import Head from 'next/head';
import Providers from '@components/Providers';
import Layout from '@components/Layout';
import AppName from '@lib/appName';

config.autoAddCss = false;

type AppProps = BaseAppProps & {
  pageProps: BaseAppProps['pageProps'] & {
    session?: Session;
  };
};

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => (
  <Providers session={session}>
    <Layout>
      <Head>
        <title>{AppName}</title>
      </Head>
      <Component {...pageProps} />
    </Layout>
  </Providers>
);

export default App;
