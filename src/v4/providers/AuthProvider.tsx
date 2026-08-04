import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type JSX,
  type PropsWithChildren,
} from 'react';

import {
  onAuthStateChanged,
  signInAnonymously,
  signOut as firebaseSignOut,
} from 'firebase/auth';

import useStore from '@utils/store';
import createUserPayload from '@utils/user';
import useFirebase from '@v4/hooks/useFirebase';
import { User } from '@yappy/types';

export type AuthStatus = 'initializing' | 'unauthenticated' | 'authenticated';

export type AuthContextValue = {
  user: User | null;
  userId: string | null;
  status: AuthStatus;
  signIn: (userName: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const Context = createContext<AuthContextValue | null>(null);

/**
 * Single owner of v4 auth: one `onAuthStateChanged` listener, one derived
 * status, and the sign-in/out actions. `useAuth` is a thin reader of this.
 */
const AuthProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const { authClient, isAppInitialized } = useFirebase();
  const {
    user,
    arePrefsInitialized,
    setPreference,
  } = useStore(({
    preferences,
    arePrefsInitialized,
    setPreference,
  }) => ({
    arePrefsInitialized,
    setPreference,
    user: preferences.user ?? null,
  }));

  const userRef = useRef(user);
  userRef.current = user;

  // Clear the stored profile if Firebase drops the anonymous session.
  useEffect(() => {
    if (!authClient) return;

    return onAuthStateChanged(authClient, (firebaseUser) => {
      if (!firebaseUser && userRef.current) {
        setPreference('user', null);
      }
    });
  }, [authClient, setPreference]);

  const signIn = useCallback(async (userName: string) => {
    if (!authClient) return;

    const { user: firebaseUser } = await signInAnonymously(authClient);
    // Use the Firebase UID as the user id so it matches auth state.
    setPreference('user', {
      ...createUserPayload(userName),
      id: firebaseUser.uid,
    });
  }, [authClient, setPreference]);

  const signOut = useCallback(async () => {
    if (!authClient) return;

    // SessionProvider tears down the session when `user` becomes null.
    await firebaseSignOut(authClient);
    setPreference('user', null);
  }, [authClient, setPreference]);

  const status: AuthStatus = useMemo(() => {
    if (!isAppInitialized || !arePrefsInitialized) return 'initializing';
    return user ? 'authenticated' : 'unauthenticated';
  }, [
    isAppInitialized,
    arePrefsInitialized,
    user,
  ]);

  const value = useMemo<AuthContextValue>(() => ({
    signIn,
    signOut,
    status,
    user,
    userId: user?.id ?? null,
  }), [
    user,
    status,
    signIn,
    signOut,
  ]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

export default AuthProvider;
