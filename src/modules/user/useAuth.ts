import { useMemo } from 'react';

import { useAuthorizedUser } from '@modules/user/AuthContext';
import {
  signIn as signInFB,
  signOut as signOutFB,
} from '@services/firebase';
import { createUserPayload } from '@utils';
import useStore from '@utils/store';
import { User } from '@yappy/types';


const useAuth = () => {
  const { userId, isInitialized } = useAuthorizedUser();
  const {
    setUser,
    storedUser,
    clearUser,
    clearRoom,
  } = useStore(({
    clearRoom,
    preferences,
    setPreferences,
  }) => ({
    clearRoom,
    clearUser: () => setPreferences('user', null),
    setUser: (newUser: User) => setPreferences('user', { ...newUser }),
    storedUser: preferences?.user,
  }));

  const signIn = async (newUserName: string) => {
    const payload = createUserPayload(newUserName);

    try {
      await signInFB();
      setUser(payload);
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = async () => {
    try {
      await signOutFB();
      clearUser();
      clearRoom();
    } catch (e) {
      console.error(e);
    }
  };

  const user = useMemo(() => {
    if (isInitialized && userId && storedUser) {
      return {
        ...storedUser,
        id: userId,
      };
    }

    return null;
  }, [
    isInitialized,
    userId,
    storedUser,
  ]);

  return {
    signIn,
    signOut,
    user,
  };
};

export { useAuth };
