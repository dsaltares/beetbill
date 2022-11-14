import Head from 'next/head';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import AppName from '@lib/appName';
import Routes from '@lib/routes';
import LinkButton from '@components/LinkButton';
import Card from '@components/Card';

const NotFoundPage = () => (
  <Card title="This is not the page you are looking for">
    <Head>
      <title>{`404 - ${AppName}`}</title>
    </Head>
    <p className="text-base"></p>
    <div className="flex w-full justify-center">
      <LinkButton startIcon={faHouse} href={Routes.home}>
        Home
      </LinkButton>
    </div>
  </Card>
);

export default NotFoundPage;
