import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

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

    return status === 'authenticated' ? <Component {...props} /> : null;
  }

  return RequireAuthentication;
};

export default WithAuthentication;
