import {
  arrayUnion,
  collection,
  doc,
  DocumentData,
  Firestore,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
  // writeBatch,
} from 'firebase/firestore';

import getApp from '.';
import { Ticket, Participant, Room, User } from '../../types';
import { PossibleFirebaseCollections } from './constants';

type PossibleFirebaseTypes = Room | Participant | Ticket;

export interface ResultType {
  data: DocumentData | Array<PossibleFirebaseTypes> | PossibleFirebaseTypes;
  error: boolean;
  message: string | null;
}

let client: Firestore;

const getDataClient = () => {
  if (client) {
    return client;
  }

  const app = getApp();

  client = getFirestore(app);
  return client;
};

const getCollection = (collectionName: PossibleFirebaseCollections) => {
  if (!collectionName) {
    return false;
  }

  const db = getDataClient();

  return collection(db, collectionName);
};


const getAllDocsFromCollection = async (
  collectionName: PossibleFirebaseCollections,
  callback: (arg: ResultType) => void,
): Promise<void> => {
  const result: ResultType = {
    data: [],
    error: false,
    message: null,
  };

  try {
    const documentCollection = getCollection(collectionName);

    if (documentCollection) {
      const documents = await getDocs(documentCollection);

      if (documents.empty) {
        callback(result);
      }

      result.data = documents.docs.map((cat) => cat.data());
    } else {
      throw new Error('Document collection does not exist.');
    }
  } catch (error) {
    result.error = true;
    result.message = `There was a problem retrieving the ${collectionName} collection`;
  }

  callback(result);
};


const getSpecifiedDocsFromCollection = async (
  collectionName: PossibleFirebaseCollections,
  matchField: string,
  id: string,
  callback: (arg: ResultType) => void,
): Promise<void> => {
  const result: ResultType = {
    data: [],
    error: false,
    message: null,
  };

  try {
    const documentCollection = getCollection(collectionName);

    if (documentCollection) {
      const q = query(documentCollection, where(matchField, '==', id));
      const documents = await getDocs(q);

      if (documents.empty) {
        callback(result);
      }

      result.data = documents.docs.map((cat) => cat.data());
    } else {
      throw new Error('Document collection does not exist.');
    }
  } catch (error) {
    result.error = true;
    result.message = `There was a problem retrieving ${id} from the ${collectionName} collection`;
  }

  callback(result);
};

const createUser = async (
  data: User,
  callback: (arg: ResultType) => void,
): Promise<void> => {
  const result: ResultType = {
    data: [],
    error: false,
    message: null,
  };

  try {
    const db = getDataClient();

    if (db) {
      await setDoc(doc(db, PossibleFirebaseCollections.USERS, data.id), data);
    } else {
      throw new Error('Failed to get data client.');
    }
  } catch (error) {
    result.error = true;
    result.message = `There was a problem creating ${ data.id } in the ${ PossibleFirebaseCollections.USERS} collection`;
  }

  callback(result);
};

/** Room Management */

const createRoom = async (
  data: Room,
  callback: (arg: ResultType) => void,
): Promise<void> => {
  const result: ResultType = {
    data: [],
    error: false,
    message: null,
  };

  try {
    const db = getDataClient();

    if (db) {
      await setDoc(doc(db, PossibleFirebaseCollections.ROOMS, data.name), data);
      result.data = data as Room;
    } else {
      throw new Error('Failed to get data client.');
    }
  } catch (error) {
    result.error = true;
    result.message = `There was a problem creating ${ data.name } in the ${ PossibleFirebaseCollections.ROOMS} collection`;
  }

  callback(result);
};

const watchRoom = (roomName: string, callback: (arg: ResultType) => void) => {
  const result: ResultType = {
    data: [],
    error: false,
    message: null,
  };

  try {
    const db = getDataClient();
    const roomRef = doc(db, PossibleFirebaseCollections.ROOMS, roomName);

    const unsubscribe = onSnapshot(roomRef, (doc) => {
      if (doc.exists()) {
        result.data = doc.data();
        callback(result);
      } else {
        result.error = true;
        result.message = `The room ${roomName} does not exist.`;
        callback(result);
      }
    });

    return unsubscribe;
  } catch (error) {
    result.error = true;
    result.message = `There was a problem watching ${roomName} in the ${ PossibleFirebaseCollections.ROOMS} collection`;
    callback(result);
  }
};

const updateRoom = async (
  room: string,
  property: string,
  data: any,
  callback?: () => void,
): Promise<void> => {

  try {
    const db = getDataClient();

    if (db) {
      const roomRef = doc(db, PossibleFirebaseCollections.ROOMS, room);

      if (property.includes('.')) {
        await updateDoc(roomRef, {
          [ property ]: data,
        });
      } else {
        await setDoc(roomRef, {
          [ property ]: data,
        }, { merge: true });
      }
    }
  } catch (error) {
    console.error(error);
  }

  callback?.();
};

/** Ticket Management */

const addTicket = async (
  room: string,
  data: Ticket,
  callback?: (arg: ResultType) => void,
): Promise<void> => {
  const result: ResultType = {
    data: [],
    error: false,
    message: null,
  };

  try {
    const db = getDataClient();

    if (db) {
      const roomRef = doc(db, PossibleFirebaseCollections.ROOMS, room);

      await updateDoc(roomRef, {
        tickets: arrayUnion(data),
      });

      result.data = data as Ticket;
    } else {
      throw new Error('Failed to get data client.');
    }
  } catch (error) {
    result.error = true;
    result.message = `There was a problem adding an ticket to ${ room } in the ${ PossibleFirebaseCollections.ROOMS} collection`;
  }

  callback?.(result);
};

export {
  addTicket,
  createRoom,
  createUser,
  getAllDocsFromCollection,
  getSpecifiedDocsFromCollection,
  updateRoom,
  watchRoom,
};
