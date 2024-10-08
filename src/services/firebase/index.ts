import { FirebaseApp, initializeApp } from 'firebase/app';

import {
  addTicket,
  createPIIReport,
  createRoom,
  createUser,
  getAllDocsFromCollection,
  getSpecifiedDocsFromCollection,
  ResultType,
  updateRoom,
  watchRoom,
} from './data';

let app: FirebaseApp;

const getApp = (): FirebaseApp => {
  if (app) {
    return app;
  }

  const config = {
    apiKey: import.meta.env.VITE_FB_API_KEY,
    authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FB_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FB_APP_ID,
  };

  app = initializeApp(config);

  return app;
};

export default getApp;

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

export type {
  ResultType,
};
