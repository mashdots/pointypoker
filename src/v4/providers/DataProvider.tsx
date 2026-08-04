import {
  createContext,
  useMemo,
  type JSX,
  type PropsWithChildren,
} from 'react';

import {
  deleteField,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
  type Unsubscribe,
} from 'firebase/firestore';

import useFirebase from '@v4/hooks/useFirebase';

/**
 * A stable, provider-scoped abstraction over Firestore read/write/listen. This
 * is the single seam through which v4 touches remote storage — one shared
 * client reference (rather than a hook rebuilt per component), and a natural
 * point to swap in a mock/fixture data source later (mirrors JiraProvider).
 */
export type DataClient = {
  read: <T>(collection: string, id: string) => Promise<T | null>;
  watch: <T>(
    collection: string,
    id: string,
    callback: (data: T | null, error?: string) => void,
  ) => Unsubscribe | null;
  write: <T extends object>(collection: string, id: string, data: T) => Promise<void>;
  patch: (collection: string, id: string, data: Record<string, unknown>) => Promise<void>;
  removeField: (collection: string, id: string, fieldPath: string) => Promise<void>;
};

export const Context = createContext<DataClient | null>(null);

const DataProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const { storageClient } = useFirebase();

  const client = useMemo<DataClient>(() => ({
    patch: async (
      collection: string,
      id: string,
      data: Record<string, unknown>,
    ): Promise<void> => {
      if (!storageClient) return;
      await updateDoc(doc(
        storageClient,
        collection,
        id,
      ), data);
    },

    read: async <T,>(collection: string, id: string): Promise<T | null> => {
      if (!storageClient) return null;
      const snapshot = await getDoc(doc(
        storageClient,
        collection,
        id,
      ));
      return snapshot.exists() ? (snapshot.data() as T) : null;
    },

    removeField: async (
      collection: string,
      id: string,
      fieldPath: string,
    ): Promise<void> => {
      if (!storageClient) return;
      await updateDoc(doc(
        storageClient,
        collection,
        id,
      ), { [fieldPath]: deleteField() });
    },

    watch: <T,>(
      collection: string,
      id: string,
      callback: (data: T | null, error?: string) => void,
    ): Unsubscribe | null => {
      if (!storageClient) return null;
      return onSnapshot(
        doc(
          storageClient,
          collection,
          id,
        ),
        (snapshot) => callback(snapshot.exists() ? (snapshot.data() as T) : null),
        (error) => callback(null, error.message),
      );
    },

    write: async <T extends object>(collection: string, id: string, data: T): Promise<void> => {
      if (!storageClient) return;
      await setDoc(doc(
        storageClient,
        collection,
        id,
      ), data);
    },
  }), [storageClient]);

  return (
    <Context.Provider value={client}>
      {children}
    </Context.Provider>
  );
};

export default DataProvider;
