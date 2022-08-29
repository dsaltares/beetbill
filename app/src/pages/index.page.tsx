import type { NextPage } from 'next';
import { useSession, signIn, signOut } from 'next-auth/react';

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <>Loading</>;
  }

  const buttonClass = 'rounded-full p-1 bg-blue-500 text-white';

  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <button className={buttonClass} onClick={() => signOut()}>
          Sign out
        </button>
      </>
    );
  }

  return (
    <>
      Not signed in <br />
      <button className={buttonClass} onClick={() => signIn()}>
        Sign in
      </button>
    </>
  );
};

export default Home;
