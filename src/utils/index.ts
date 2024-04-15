import { getUserCookie, setUserCookie } from './cookies';
import createUserPayload from './user';
import generateRoomName from './room';

const getRandomInt = (size: number): number => {
  const min = Math.ceil(0);
  const max = Math.floor(size);

  // return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  return (Math.floor(Math.pow(10, 14) * Math.random() * Math.random()) % (max - min + 1)) + min;
};

export {
  createUserPayload,
  generateRoomName,
  getRandomInt,
  getUserCookie,
  setUserCookie,
};
