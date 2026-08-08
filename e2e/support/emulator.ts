/**
 * Helpers for talking to the Firebase emulators' admin REST endpoints.
 *
 * The emulators are started by `firebase emulators:exec` (see the `test:e2e`
 * script) using the offline `demo-yappy` project. Between tests we wipe their
 * state so every spec starts from an empty Firestore + auth registry.
 */

const PROJECT_ID = 'demo-yappy';
const FIRESTORE_HOST = process.env.FIRESTORE_EMULATOR_HOST ?? '127.0.0.1:4001';
const AUTH_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST ?? '127.0.0.1:4002';

const clearFirestore = async (): Promise<void> => {
  const url = `http://${FIRESTORE_HOST}/emulator/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
  const res = await fetch(url, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error(`Failed to clear Firestore emulator: ${res.status} ${res.statusText}`);
  }
};

const clearAuth = async (): Promise<void> => {
  const url = `http://${AUTH_HOST}/emulator/v1/projects/${PROJECT_ID}/accounts`;
  const res = await fetch(url, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error(`Failed to clear Auth emulator: ${res.status} ${res.statusText}`);
  }
};

/** Wipe all Firestore documents and auth accounts from the emulators. */
export const resetEmulators = async (): Promise<void> => {
  await Promise.all([clearFirestore(), clearAuth()]);
};
