import { md } from 'node-forge';

import { getUserCookie, setUserCookie } from './cookies';
import createUserPayload from './user';
import generateRoomName from './room';

const generateHash = (value: string) => {
  const hash = md.sha256.create();
  hash.update(value);

  return hash.digest().toHex();
};

export {
  createUserPayload,
  generateHash,
  generateRoomName,
  getUserCookie,
  setUserCookie,
};
