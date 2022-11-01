import '../styles/globals.css';

import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import type { AppProps as BaseAppProps } from 'next/app';
import type { Session } from 'next-auth';
import Head from 'next/head';
import Script from 'next/script';
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
    <Script
      id="cookie-banner"
      src="https://cdn.websitepolicies.io/lib/cookieconsent/cookieconsent.min.js"
      defer
    />
    <Script
      id="cookie-banner-init"
      dangerouslySetInnerHTML={{
        __html: `window.addEventListener("load",function(){window.wpcc.init({"border":"thin","corners":"small","colors":{"popup":{"background":"#F5F3FF","text":"#000000","border":"#6D28D9"},"button":{"background":"#6D28D9","text":"#ffffff"}},"position":"bottom","content":{"href":"https://invoicing.saltares.com/invoicing_cookie_policy.pdf","message":"This app uses cookies to ensure the best possible experience."}})});`,
      }}
    />
  </Providers>
);

export default App;
