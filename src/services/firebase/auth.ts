import type { Auth, Unsubscribe } from 'firebase/auth';
import {
  browserLocalPersistence,
  connectAuthEmulator,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInAnonymously,
  signOut as signOutFirebase,
} from 'firebase/auth';

import getApp from '.';

let client: Auth;

type ResultResponse = {
  userId?: string | null;
  error?: string | null;
};

const getAuthClient = (): Auth => {
  if (client) {
    return client;
  }

  const app = getApp();

  client = getAuth(app);

  // In e2e/test mode, point the auth client at the local emulator so tests run
  // fully offline against a `demo-` project. Gated on a dedicated flag (not
  // `import.meta.env.DEV`) so normal `yarn start` keeps hitting real Firebase.
  if (import.meta.env.VITE_USE_EMULATORS === 'true') {
    connectAuthEmulator(client, 'http://127.0.0.1:4002', { disableWarnings: true });
  }

  return client;
};

const signIn = async (): Promise<ResultResponse> => {
  const result: ResultResponse = {
    error: null,
    userId: null,
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
    error: null,
    userId: null,
  };

  try {
    const authClient = getAuthClient();
    await signOutFirebase(authClient);
  } catch (e) {
    result.error = e as string;
  }

  return result;
};

const watchForUserId = (callback: (arg: string) => void): Unsubscribe => {
  const authClient = getAuthClient();
  return onAuthStateChanged(authClient, (user) => {
    callback((user && user.uid) || '');
  });
};

export {
  getAuthClient,
  watchForUserId,
  signIn,
  signOut,
};
