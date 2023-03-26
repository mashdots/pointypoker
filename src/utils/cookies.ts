import Cookies from 'universal-cookie';
import { User } from '../types';

const USER_COOKIE = 'yappy-user';
const cookies = new Cookies();

const getUserCookie = () => {
  const userCookie = cookies.get(USER_COOKIE);

  return userCookie ? JSON.parse(atob(userCookie)) : null;
};

const setUserCookie = (user: User) => {
  const encryptedID = btoa(JSON.stringify(user));
  cookies.set(USER_COOKIE, encryptedID, { expires: new Date('2100/01/01') });
};

export {
  getUserCookie,
  setUserCookie,
};
