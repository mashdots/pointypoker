import { useParams } from 'react-router';

import useAuth from '@v4/hooks/useAuth';
import useSession from '@v4/hooks/useSession';
import SessionProvider from '@v4/providers/SessionProvider';

import Room from './room';
import Setup from './setup';

/**
 * Decides Setup vs Room from auth + session status. Rendered inside
 * SessionProvider so the session subscription outlives this swap.
 */
const V4Content = () => {
  const { status: authStatus } = useAuth();
  const { status: sessionStatus } = useSession();

  if (authStatus === 'authenticated' && sessionStatus === 'loaded') {
    return <Room />;
  }

  return <Setup />;
};

const V4Switcher = () => {
  const { roomName } = useParams();

  return (
    <SessionProvider roomName={roomName}>
      <V4Content />
    </SessionProvider>
  );
};

export default V4Switcher;
