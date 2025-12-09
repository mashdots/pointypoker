import { Timestamp } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';

export type UserPayload = {
  name: string;
  id: string;
  created: Timestamp;
};

const createUserPayload = (name: string): UserPayload => ({
  created: Timestamp.fromDate(new Date()),
  id: uuid(),
  name,
});

export default createUserPayload;
