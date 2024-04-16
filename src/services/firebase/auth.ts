import type { Auth } from 'firebase/auth';
import {
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInAnonymously,
  signOut as signOutFirebase,
  // connectAuthEmulator,
} from 'firebase/auth';

import getApp from '.';

let client: Auth;

type ResultResponse = {
  userId?: string | null;
  error?: string | null;
}

const getAuthClient = (): Auth => {
  if (client) {
    return client;
  }

  const app = getApp();

  client = getAuth(app);
  // REMOVE THIS
  // connectAuthEmulator(client, 'http://localhost:9099');
  return client;
};

const signIn = async (): Promise<ResultResponse> => {
  const result: ResultResponse = {
    userId: null,
    error: null,
  };

  try {
    const authClient = getAuthClient();

    await setPersistence(authClient, browserLocalPersistence);
    const { user } = await signInAnonymously(authClient);

    result.userId = user.uid;
  } catch (e) {
    result.error = e as string;
    throw result.error;
  }

  return result;
};

const signOut = async (): Promise<ResultResponse> => {
  const result: ResultResponse = {
    userId: null,
    error: null,
  };

  try {
    const authClient = getAuthClient();
    await signOutFirebase(authClient);
  } catch (e) {
    result.error = e as string;
  }

  return result;
};

const watchForUserId = (callback: (arg: string) => void): void => {
  const authClient = getAuthClient();
  onAuthStateChanged(authClient, (user) => {
    callback((user && user.uid) || '');
  });
};

export { getAuthClient, watchForUserId, signIn, signOut };
