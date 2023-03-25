import Cookies from 'universal-cookie';
import { generateHash } from '.';

const USER_COOKIE = 'yappy-user';
const cookies = new Cookies();

const getUserCookie = () => {
  const userCookie = cookies.get(USER_COOKIE);

  if (userCookie) {
    console.log(JSON.parse(atob(userCookie)));
  }

  return userCookie;
};

const setUserCookie = (name: string) => {
  const uniqueNameId = `${name}-${Date.now()}`;
  const userPayload = {
    name,
    id: generateHash(uniqueNameId),
  };
  const encryptedID = btoa(JSON.stringify(userPayload));

  cookies.set(USER_COOKIE, encryptedID, { expires: new Date('2100/01/01') });
};

export {
  getUserCookie,
  setUserCookie,
};
