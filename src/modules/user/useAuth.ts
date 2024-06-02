import { useEffect } from 'react';
import { getCookie, setCookie, clearCookie } from '../../utils/cookies';
import useStore from '../../utils/store';
import { createUserPayload } from '../../utils';
import {
  getAuthClient,
  signIn as signInFB,
  signOut as signOutFB,
} from '../../services/firebase/auth';


const useAuth = () => {
  const { setUser, user, clearUser, clearRoom } = useStore(
    ({ setUser, user, clearUser, clearRoom }) => ({
      setUser,
      user,
      clearUser,
      clearRoom,
    }),
  );
  const userCookie = getCookie();

  const signIn = async (newUserName: string) => {
    const payload = createUserPayload(newUserName);

    try {
      const anonUser = await signInFB();
      payload.id = anonUser.userId as string;
      setCookie(payload);
      setUser(payload);
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = ()  => {
    try {
      signOutFB();
      clearUser();
      clearRoom();
      clearCookie();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (userCookie && !user) {
      getAuthClient();
      setUser(userCookie);
    }
  }, [user]);

  return {
    signIn,
    signOut,
    user,
  };
};

export {
  useAuth,
};
