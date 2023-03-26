import React from 'react';

import getRandomInt from '../../utils';
import { adjectives, animals } from './dictionaries';

const generateRoomName = (): string => {
  const adjective = adjectives[getRandomInt(adjectives.length - 1)];
  const animal = animals[getRandomInt(animals.length - 1)];

  console.log('hit');
  return `${adjective}-${animal}`;
};

const RoomCreator =  () => {
  console.log((generateRoomName()));

  return <div></div>;
};

export default RoomCreator;
