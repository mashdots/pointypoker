import { createContext } from 'react';

import type { AuthContext } from '@yappy/types/user';

const Context = createContext<AuthContext>({
  isAuthenticated: false,
  isInitialized: false,
  userId: null,
});

export default Context;
