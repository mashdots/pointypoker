import { v4 as uuid } from 'uuid';

const createUserPayload = (name: string) => {
  const userPayload = {
    name,
    id: uuid(),
  };

  return userPayload;
};

export default createUserPayload;
