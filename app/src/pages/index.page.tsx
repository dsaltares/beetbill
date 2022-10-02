import type { GetServerSideProps, NextPage } from 'next';

const Home: NextPage = () => null;

export default Home;

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: '/invoices',
    permantent: false,
  },
  props: {},
});
