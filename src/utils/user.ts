import { v4 as uuid } from 'uuid';

export type UserPayload = {
  name: string;
  id: string;
  created: string;
};

const createUserPayload = (name: string): UserPayload => {
  const userPayload = {
    name,
    id: uuid(),
    created: new Date().toISOString(),
  };

  return userPayload;
};

export default createUserPayload;
