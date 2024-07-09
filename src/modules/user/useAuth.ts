import { useEffect } from 'react';

import { getCookie, clearCookie } from '../../utils/cookies';
import useStore from '../../utils/store';
import { createUserPayload } from '../../utils';
import {
  getAuthClient,
  signIn as signInFB,
  signOut as signOutFB,
} from '../../services/firebase/auth';
import { User } from '../../types';


const useAuth = () => {
  const { setUser, user, clearUser, clearRoom } = useStore(
    ({ clearRoom, preferences, setPreferences }) => ({
      setUser: (newUser: User) => setPreferences('user', { ...newUser }),
      user: preferences?.user,
      clearUser: () => setPreferences('user', null),
      clearRoom,
    }),
  );
  const userCookie = getCookie();

  const signIn = async (newUserName: string) => {
    const payload = createUserPayload(newUserName);

    try {
      const anonUser = await signInFB();
      payload.id = anonUser.userId as string;
      setUser(payload as User);
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = ()  => {
    try {
      signOutFB();
      clearUser();
      clearRoom();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // Deprecated - Legacy user name management
    if (userCookie) {
      setUser(userCookie);
      clearCookie();
    }

    if (user) {
      getAuthClient();
    }
  }, [user?.id]);

  return {
    signIn,
    signOut,
    user,
  };
};

export {
  useAuth,
};
