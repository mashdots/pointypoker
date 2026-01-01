import {
  JSX,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Unsubscribe } from 'firebase/auth';

import { watchForUserId } from '@services/firebase';
import type { AuthContext as AuthContextType } from '@yappy/types/user';

import { AuthContext } from '.';

const AuthProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const authListener = useRef<Unsubscribe | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const value: AuthContextType = useMemo(() => ({
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


export default AuthProvider;
