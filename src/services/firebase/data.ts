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
import { PossibleFirebaseCollections } from './constants';
import { Ticket, Participant, Room, User } from '@yappy/types';
import PIIReport from '@yappy/types/piiReport';

type PossibleFirebaseTypes = Room | Participant | Ticket;

export type ResultType<T = undefined> = {
  data: T extends PossibleFirebaseTypes ? T : (DocumentData[] | DocumentData);
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
  callback: (arg: ResultType<typeof data>) => void,
): Promise<void> => {
  const result: ResultType<typeof data> = {
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

const createPIIReport = async (
  data: PIIReport,
): Promise<void> => {
  const result: ResultType = {
    data: [],
    error: false,
    message: null,
  };

  try {
    const db = getDataClient();

    if (db) {
      await setDoc(doc(db, PossibleFirebaseCollections.PII_REPORTS, data.id), data);
      result.data = data as PIIReport;
    } else {
      throw new Error('Failed to get data client.');
    }
  } catch (error) {
    result.error = true;
    result.message = `There was a problem creating ${ data.id } in the ${ PossibleFirebaseCollections.PII_REPORTS } collection`, error;
  }
};

/** Room Management */

const createRoom = async (
  data: Room,
  callback: (arg: ResultType<typeof data>) => void,
): Promise<void> => {
  const result: ResultType<typeof data> = {
    data,
    error: false,
    message: null,
  };

  try {
    const db = getDataClient();

    if (db) {
      await setDoc(doc(db, PossibleFirebaseCollections.ROOMS, data.name), data);
    } else {
      throw new Error('Failed to get data client.');
    }
  } catch (error) {
    result.error = true;
    result.message = `There was a problem creating ${ data.name } in the ${ PossibleFirebaseCollections.ROOMS } collection`, error;
  }

  callback(result);
};

const watchRoom = (roomName: string, callback: (arg: ResultType<Room>) => void) => {
  const result: ResultType<Room> = {
    data: {} as Room,
    error: false,
    message: null,
  };

  try {
    const db = getDataClient();
    const roomRef = doc(db, PossibleFirebaseCollections.ROOMS, roomName);

    const unsubscribe = onSnapshot(roomRef, (doc) => {
      if (doc.exists()) {
        result.data = doc.data() as Room;
      } else {
        result.error = true;
        result.message = `The room ${roomName} does not exist.`;
      }

      callback(result);
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
  data: Record<string, any>,
  callback?: () => void,
): Promise<void> => {
  if (!room || (data === undefined || data === null)) {
    console.error('Unexpected error while updating a room.');
    return;
  }

  try {
    const db = getDataClient();

    if (db) {
      const roomRef = doc(db, PossibleFirebaseCollections.ROOMS, room);
      await updateDoc(roomRef, data);
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
  callback?: (arg: ResultType<typeof data>) => void,
): Promise<void> => {
  const result: ResultType<typeof data> = {
    data,
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
  createPIIReport,
  createRoom,
  createUser,
  getAllDocsFromCollection,
  getSpecifiedDocsFromCollection,
  updateRoom,
  watchRoom,
};
