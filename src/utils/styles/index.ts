import GlobalStyles from './global';

/**
 * Gets a string width based on a specified width or fraction.
 *
 * @param {string | number} value a word describing the width of an item, or a number describing the percentage
 * @returns {string} the width in percent format
 */
function getWidth(value?: string | number): string {
  if (typeof value === 'number') {
    return `${ value }rem`;
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

export {
  GlobalStyles,
  getWidth,
};
