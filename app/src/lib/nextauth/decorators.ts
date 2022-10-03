import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';

export const withNoAuth = <T extends GetServerSideProps>(
  getServerSideProps: T
) => {
  const wrappedGetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const session = await getSession(ctx);
    if (session) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
        props: {},
      };
    }

    return getServerSideProps(ctx);
  };

  return wrappedGetServerSideProps as typeof getServerSideProps;
};
