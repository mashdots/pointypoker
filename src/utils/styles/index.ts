import { VARIATIONS } from './colors';
import GlobalStyles from './global';

/**
 * Gets a string width based on a specified width or fraction.
 *
 * @param {string | number} value a word describing the width of an item, or a number describing the percentage
 * @returns {string} the width in percent format
 */
function getWidth(value?: string | number): string {
  if (typeof value === 'number') {
    return `${ value }px`;
  }

  switch (value) {
  case 'quarter':
    return '25%';
  case 'third':
    return '33%';
  case 'half':
    return '50%';
  case 'full':
  default:
    return '100%';
  }
}

/**
 * Gets a CSS margin string.
 *
 * @param {string} value a word describing where to place the 16px margin
 * @returns {string} the CSS string laying out the margins
 */
const getMargin = (value?: string) => {
  switch (value) {
  case 'left':
    return '16px auto 16px 16px';
  case 'right':
    return '16px 16px 16px auto';
  case 'center':
  default:
    return '16px auto';
  }
};

export {
  GlobalStyles,
  VARIATIONS,
  getMargin,
  getWidth,
};
