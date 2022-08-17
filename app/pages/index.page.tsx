import type { NextPage } from 'next';
import { useSession, signIn, signOut } from 'next-auth/react';
import useHello from '@lib/useHello';

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const { data: greeting } = useHello({
    text: session?.user?.email ?? 'Guest',
  });

  if (status === 'loading') {
    return <>Loading</>;
  }

  const greetingComponent = <>{greeting}</>;
  const buttonClass = 'rounded-full p-1 bg-blue-500 text-white';

  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <button className={buttonClass} onClick={() => signOut()}>
          Sign out
        </button>
        {greetingComponent}
      </>
    );
  }

  return (
    <>
      Not signed in <br />
      <button className={buttonClass} onClick={() => signIn()}>
        Sign in
      </button>
      {greetingComponent}
    </>
  );
};

export default Home;
