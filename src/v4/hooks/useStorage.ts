import { useCallback } from 'react';

import {
  deleteField,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  Unsubscribe,
  updateDoc,
} from 'firebase/firestore';

import { useFirebaseContext } from '@v4/providers/FirebaseProvider';

const useStorage = () => {
  const { firestore } = useFirebaseContext();

  const get = useCallback(async <T>(
    collection: string,
    id: string,
  ): Promise<T | null> => {
    const ref = doc(
      firestore,
      collection,
      id,
    );
    const snapshot = await getDoc(ref);

    return snapshot.exists() ? (snapshot.data() as T) : null;
  }, [firestore]);

  const watch = useCallback(<T>(
    collection: string,
    id: string,
    callback: (data: T | null, error?: string) => void,
  ): Unsubscribe => {
    const ref = doc(
      firestore,
      collection,
      id,
    );

    return onSnapshot(
      ref,
      (snapshot) => {
        callback(snapshot.exists() ? (snapshot.data() as T) : null);
      },
      (error) => {
        callback(null, error.message);
      },
    );
  }, [firestore]);

  const set = useCallback(async <T extends object>(
    collection: string,
    id: string,
    data: T,
  ): Promise<void> => {
    const ref = doc(
      firestore,
      collection,
      id,
    );
    await setDoc(ref, data);
  }, [firestore]);

  const update = useCallback(async (
    collection: string,
    id: string,
    data: Record<string, unknown>,
  ): Promise<void> => {
    const ref = doc(
      firestore,
      collection,
      id,
    );
    await updateDoc(ref, data);
  }, [firestore]);

  const removeField = useCallback(async (
    collection: string,
    id: string,
    fieldPath: string,
  ): Promise<void> => {
    const ref = doc(
      firestore,
      collection,
      id,
    );
    await updateDoc(ref, { [fieldPath]: deleteField() });
  }, [firestore]);

  return {
    get,
    removeField,
    set,
    update,
    watch,
  };
};

export default useStorage;
