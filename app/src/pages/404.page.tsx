import Head from 'next/head';
import {
  faHouse,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from '@components/Card';
import AppName from '@lib/appName';
import Routes from '@lib/routes';
import LinkButton from '@components/LinkButton';

const NotFoundPage = () => (
  <Card>
    <Head>
      <title>{`404 - ${AppName}`}</title>
    </Head>
    <div className="flex flex-col gap-8">
      <div className="flex flex-col justify-center gap-3">
        <FontAwesomeIcon
          className="text-4xl text-violet-800"
          icon={faTriangleExclamation}
        />
        <h1 className="text-2xl font-bold">
          This is not the page you are looking for.
        </h1>
      </div>
      <p className="text-base"></p>
      <div className="flex w-full justify-center">
        <LinkButton startIcon={faHouse} href={Routes.home}>
          Home
        </LinkButton>
      </div>
    </div>
  </Card>
);

export default NotFoundPage;
