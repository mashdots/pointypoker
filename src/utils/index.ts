import { md } from 'node-forge';

import { getUserCookie, setUserCookie } from './cookies';

const generateHash = (value: string) => {
  const hash = md.sha256.create();
  hash.update(value);

  return hash.digest().toHex();
};

const getRandomInt = (size: number): number => {
  const min = Math.ceil(0);
  const max = Math.floor(size);

  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};

export {
  generateHash,
  getUserCookie,
  getRandomInt,
  setUserCookie,
};
