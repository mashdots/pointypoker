import {
  collection,
  doc,
  DocumentData,
  Firestore,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
  // writeBatch,
} from 'firebase/firestore';

import getApp from '.';
import { Issue, Participant, Room, User } from '../../types';
import { PossibleFirebaseCollections } from './constants';

type PossibleFirebaseTypes = Room | Participant | Issue

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
      await setDoc(doc(db, PossibleFirebaseCollections.ROOMS, data.id), data);
      result.data = data;
    } else {
      throw new Error('Failed to get data client.');
    }
  } catch (error) {
    result.error = true;
    result.message = `There was a problem creating ${ data.id } in the ${ PossibleFirebaseCollections.USERS} collection`;
  }

  callback(result);
};


export {
  createRoom,
  createUser,
  getAllDocsFromCollection,
  getSpecifiedDocsFromCollection,
};
