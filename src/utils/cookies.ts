import Cookies from 'universal-cookie';
import { Buffer } from 'buffer';

enum COOKIE_TYPES {
  USER = 'yappy-user',
}
const cookies = new Cookies();

const getCookie = () => {
  const userCookie = cookies.get(COOKIE_TYPES.USER);

  return userCookie ? JSON.parse(Buffer.from(userCookie, 'base64').toString('ascii')) : null;
};

const setCookie = (value: object) => {
  const encryptedID = Buffer.from(JSON.stringify(value)).toString('base64');
  cookies.set(COOKIE_TYPES.USER, encryptedID, { expires: new Date('2100/01/01'), sameSite: 'lax' });
};

const clearCookie = () => {
  cookies.remove(COOKIE_TYPES.USER);
};

export {
  getCookie,
  setCookie,
  clearCookie,
};
