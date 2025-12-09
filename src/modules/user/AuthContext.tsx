import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Unsubscribe } from 'firebase/auth';

import { watchForUserId } from '@services/firebase';

type AuthContext = {
  isInitialized: boolean;
  isAuthenticated: boolean;
  userId: string | null;
};

const AuthContext = createContext<AuthContext>({
  isAuthenticated: false,
  isInitialized: false,
  userId: null,
});

const AuthProvider = ({ children }: PropsWithChildren) => {
  const authListener = useRef<Unsubscribe | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const value: AuthContext = useMemo(() => ({
    isAuthenticated,
    isInitialized,
    userId,
  }), [
    isInitialized,
    isAuthenticated,
    userId,
  ]);

  useEffect(() => {
    authListener.current = watchForUserId((auth) => {
      setIsAuthenticated(!!auth);
      setUserId(auth || null);
      setIsInitialized(true);
    });

    return () => {
      authListener.current?.();
      authListener.current = null;
    };
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


const useAuthorizedUser = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthorizedUser must be used within an AuthProvider');
  }

  return context;
};

export default AuthProvider;
export { useAuthorizedUser };
