import '../styles/globals.css';

import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import type { AppProps } from 'next/app';
import Providers from '@components/Providers';
import Layout from '@components/Layout';

config.autoAddCss = false;

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => (
  <Providers session={session}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </Providers>
);

export default App;
