import { adjectives, animals } from './dictionaries';

const getRandomInt = (size: number): number => {
  const min = Math.ceil(0);
  const max = Math.floor(size);

  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};

const generateRoomName = (): string => {
  const adjective = adjectives[ getRandomInt(adjectives.length - 1) ];
  const animal = animals[ getRandomInt(animals.length - 1) ];

  console.log('hit');
  return `${ adjective }-${ animal }`;
};

export default generateRoomName;
