import { getRandomInt } from '../utils';
import { adjectives, animals, plants, vehicles } from './dictionaries';

const generateRoomName = (): string => {
  const nouns = [
    animals,
    plants,
    vehicles,
  ];

  const nounCategory = nouns[ getRandomInt(nouns.length - 1) ];
  const adjective = adjectives[ getRandomInt(adjectives.length - 1) ];
  const noun = nounCategory[ getRandomInt(nounCategory.length - 1) ];

  return `${ adjective }-${ noun }`;
};

export default generateRoomName;
