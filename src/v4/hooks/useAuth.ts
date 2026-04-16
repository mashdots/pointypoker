import {
  useCallback,
  useEffect,
  useRef,
} from 'react';

import {
  onAuthStateChanged,
  signInAnonymously,
  signOut as firebaseSignOut,
} from 'firebase/auth';

import useStore from '@utils/store';
import createUserPayload from '@utils/user';
import { useFirebaseContext } from '@v4/providers/FirebaseProvider';

const useAuth = () => {
  const { auth } = useFirebaseContext();
  const {
    user,
    setPreference,
    clearSession,
  } = useStore(({
    preferences,
    setPreference,
    clearSession,
  }) => ({
    clearSession,
    setPreference,
    user: preferences.user ?? null,
  }));

  const userRef = useRef(user);
  userRef.current = user;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser && userRef.current) {
        setPreference('user', null);
      }
    });

    return unsubscribe;
  }, [auth, setPreference]);

  const signIn = useCallback(async (userName: string) => {
    const { user: firebaseUser } = await signInAnonymously(auth);
    const payload = createUserPayload(userName);

    // Use the Firebase UID as the user id so it matches auth state
    setPreference('user', {
      ...payload,
      id: firebaseUser.uid,
    });
  }, [auth, setPreference]);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    setPreference('user', null);
    clearSession();
  }, [
    auth,
    setPreference,
    clearSession,
  ]);

  return {
    isAuthenticated: !!user,
    isInitialized: true,
    signIn,
    signOut,
    user,
    userId: user?.id ?? null,
  };
};

export default useAuth;
