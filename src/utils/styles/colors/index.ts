import useTheme from './colorSystem';
import { VARIATIONS } from './legacyColors';

/**
 * REFERENCE ↴
 * https://www.radix-ui.com/docs/colors/palette-composition/understanding-the-scale
 */

export interface VariationProperties {
  [ key: string ]: string;
  // 1 - App background
  bg: string;
  // 2 - Subtle background
  bgAlt: string;
  // 3 - Component backgrounds: normal state
  bgElement: string;
  // 4 - Component backgrounds: hover state
  bgElementHover: string;
  // 5 - Component backgrounds: pressed / selected state
  bgElementActive: string;
  // 6 - Borders: Subtle borders for non-interactive components
  border: string;
  // 7 - Borders: Borders for interactive elements
  borderElement: string;
  // 8 - Borders: Borders for interactive elements in hover state
  borderElementHover: string;
  // 9 - Solid backgrounds
  solidBg: string;
  // 10 - Hovered solid backgrounds
  hoverSolidBg: string;
  // 11 - Low-contrast text
  textLowContrast: string;
  // 12 - High-contrast text
  textHighContrast: string;
}

export default useTheme;
export {
  VARIATIONS as LEGACY_COLORS,
};
