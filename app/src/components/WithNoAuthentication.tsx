import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Spinner from './Spinner';

const WithNoAuthentication = <P extends object>(
  Component: React.ComponentType<P>
) => {
  function RequireNoAuthentication(props: P) {
    const router = useRouter();
    const { status } = useSession();

    useEffect(() => {
      if (status === 'authenticated') {
        void router.push('/');
      }
    }, [router, status]);

    if (status !== 'unauthenticated') {
      return (
        <div className="w-full h-screen flex items-center justify-center">
          <Spinner />
        </div>
      );
    }

    return <Component {...props} />;
  }

  return RequireNoAuthentication;
};

export default WithNoAuthentication;
