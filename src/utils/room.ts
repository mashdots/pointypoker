import { getRandomInt } from '../utils';
import { adjectives, nouns } from './dictionaries';

const generateRoomName = (): string => {
  const adjective = adjectives[getRandomInt(adjectives.length - 1)];
  const noun = nouns[getRandomInt(nouns.length - 1)];

  return `${adjective}-${noun}`;
};

export default generateRoomName;
