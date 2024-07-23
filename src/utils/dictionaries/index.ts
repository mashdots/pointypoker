import adjectives from './adjectives';
import animals from './animals';
import furniture from './furniture';
import instruments from './instruments';
import plants from './plants';
import vehicles from './vehicles';

const nouns = [
  ...animals,
  ...furniture,
  ...instruments,
  ...plants,
  ...vehicles,
];

export {
  adjectives,
  nouns,
};
