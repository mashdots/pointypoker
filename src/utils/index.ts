import { useEffect, useRef } from 'react';

import { getCookie, setCookie } from './cookies';
import generateRoomName from './room';
import createUserPayload from './user';

const getRandomInt = (size: number): number => {
  const min = Math.ceil(0);
  const max = Math.floor(size);

  return (Math.floor(Math.pow(10, 14) * Math.random() * Math.random()) % (max - min + 1)) + min;
};


const usePrevious = <T>(value: T): T | null => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

const isDev = import.meta.env.MODE === 'development';

const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

export {
  createUserPayload,
  generateRoomName,
  getRandomInt,
  getCookie,
  setCookie,
  usePrevious,
  isDev,
  wait,
};
