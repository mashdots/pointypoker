import { v4 as uuid } from 'uuid';

const createUserPayload = (name: string) => {
  const userPayload = {
    name,
    id: uuid(),
    created: new Date().toISOString(),
  };

  return userPayload;
};

export default createUserPayload;
