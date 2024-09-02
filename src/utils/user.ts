import { v4 as uuid } from 'uuid';

export type UserPayload = {
  name: string;
  id: string;
  created: string;
};

const createUserPayload = (name: string): UserPayload => ({
  name,
  id: uuid(),
  created: new Date().toISOString(),
});

export default createUserPayload;
