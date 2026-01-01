import blueberry from './blueberry';
import dirt from './dirt';
import grape from './grape';
import mint from './mint';
import orange from './orange';
import strawberry from './strawberry';
import whatever from './whatever';

export enum THEMES {
  WHATEVER = 'whatever',
  BLUEBERRY = 'blueberry',
  DIRT = 'dirt',
  GRAPE = 'grape',
  MINT = 'mint',
  ORANGE = 'orange',
  STRAWBERRY = 'strawberry',
}

export const THEME_COLORS = [
  'primary',
  'greyscale',
  'success',
  'warning',
  'error',
  'info',
] as const;

export {
  blueberry,
  whatever,
  dirt,
  grape,
  mint,
  orange,
  strawberry,
};
