import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

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

    return status === 'unauthenticated' ? <Component {...props} /> : null;
  }

  return RequireNoAuthentication;
};

export default WithNoAuthentication;
