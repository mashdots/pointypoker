import { useEffect, useRef } from 'react';
import { getCookie, setCookie } from './cookies';
import createUserPayload from './user';
import generateRoomName from './room';

const getRandomInt = (size: number): number => {
  const min = Math.ceil(0);
  const max = Math.floor(size);

  return (Math.floor(Math.pow(10, 14) * Math.random() * Math.random()) % (max - min + 1)) + min;
};


const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [ value ]);

  return ref.current;
};

const isDev = import.meta.env.MODE === 'development';

export {
  createUserPayload,
  generateRoomName,
  getRandomInt,
  getCookie,
  setCookie,
  usePrevious,
  isDev,
};
