import Cookies from 'universal-cookie';
import { User } from '../types';
import { Buffer } from 'buffer';

const USER_COOKIE = 'yappy-user';
const cookies = new Cookies();

const getUserCookie = () => {
  const userCookie = cookies.get(USER_COOKIE);

  return userCookie ? JSON.parse(Buffer.from(userCookie, 'base64').toString('ascii')) : null;
};

const setUserCookie = (user: User) => {
  const encryptedID = Buffer.from(JSON.stringify(user)).toString('base64');
  cookies.set(USER_COOKIE, encryptedID, { expires: new Date('2100/01/01') });
};

export {
  getUserCookie,
  setUserCookie,
};
