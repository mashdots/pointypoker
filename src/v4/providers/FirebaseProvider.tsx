import {
  createContext,
  useEffect,
  useState,
  type JSX,
  type PropsWithChildren,
} from 'react';

import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  connectAuthEmulator,
  getAuth,
  type Auth,
} from 'firebase/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
  type Firestore,
} from 'firebase/firestore';

type FirebaseContext = {
  authClient: Auth | null;
  firebaseApp: FirebaseApp | null;
  storageClient: Firestore | null;
  isAppInitialized: boolean;
};

export const Context = createContext<FirebaseContext>({
  authClient: null,
  firebaseApp: null,
  isAppInitialized: false,
  storageClient: null,
});

const FirebaseProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp | null>(null);
  const [authClient, setAuthClient] = useState<Auth | null>(null);
  const [storageClient, setStorageClient] = useState<Firestore | null>(null);
  const [isAppInitialized, setIsAppInitialized] = useState(false);

  useEffect(() => {
    const setupApp = () => {
      const config = {
        apiKey: import.meta.env.VITE_FB_API_KEY,
        appId: import.meta.env.VITE_FB_APP_ID,
        authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
        messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID,
        projectId: import.meta.env.VITE_FB_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
      };

      const app = initializeApp(config);
      const auth = getAuth(app);
      const firestore = getFirestore(app);

      if (import.meta.env.DEV) {
        console.log('EMULATOR STARTING');
        connectAuthEmulator(auth, 'http://127.0.0.1:4002');
        console.log('AUTH');
        connectFirestoreEmulator(
          firestore,
          '127.0.0.1',
          4001,
        );
        console.log('FIRESTORE');
      }

      setFirebaseApp(app);
      setStorageClient(firestore);
      setAuthClient(auth);
      setIsAppInitialized(true);
    };

    if (!isAppInitialized) {
      setupApp();
    }
  }, [isAppInitialized]);

  return (
    <Context.Provider
      value={{
        authClient,
        firebaseApp,
        isAppInitialized,
        storageClient,
      }}
    >
      {children}
    </Context.Provider>
  );
};


export default FirebaseProvider;
