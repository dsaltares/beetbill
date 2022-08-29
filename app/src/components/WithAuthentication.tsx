import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Spinner from './Spinner';

const WithAuthentication = <P extends object>(
  Component: React.ComponentType<P>
) => {
  function RequireAuthentication(props: P) {
    const router = useRouter();
    const { status } = useSession();

    useEffect(() => {
      if (status === 'unauthenticated') {
        void router.push('/api/auth/signin');
      }
    }, [router, status]);

    if (status !== 'authenticated') {
      return (
        <div className="w-full h-screen flex items-center justify-center">
          <Spinner />
        </div>
      );
    }

    return <Component {...props} />;
  }

  return RequireAuthentication;
};

export default WithAuthentication;
