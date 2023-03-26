import { generateHash } from '.';

const createUserPayload = (name: string) => {
  const uniqueNameId = `${ name }-${ Date.now() }`;
  const userPayload = {
    name,
    id: generateHash(uniqueNameId),
  };

  return userPayload;
};

export default createUserPayload;
