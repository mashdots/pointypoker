import { useContext } from 'react';

import {
  Context as SessionContext,
  type SessionContextValue,
} from '@v4/providers/SessionProvider';

const useSession = (): SessionContextValue => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }

  return context;
};

export default useSession;
