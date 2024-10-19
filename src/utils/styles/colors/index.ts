import useTheme from './colorSystem';
import { VARIATIONS } from './legacyColors';

/**
 * REFERENCE ↴
 * https://www.radix-ui.com/docs/colors/palette-composition/understanding-the-scale
 */

export interface VariationProperties {
  [ key: string ]: string;
  // 1 - App background
  accent1: string;
  // 2 - Subtle background
  accent2: string;
  // 3 - Component backgrounds: normal state
  accent3: string;
  // 4 - Component backgrounds: hover state
  accent4: string;
  // 5 - Component backgrounds: pressed / selected state
  accent5: string;
  // 6 - Borders: Subtle borders for non-interactive components
  accent6: string;
  // 7 - Borders: Borders for interactive elements
  accent7: string;
  // 8 - Borders: Borders for interactive elements in hover state
  accent8: string;
  // 9 - Solid backgrounds
  accent9: string;
  // 10 - Hovered solid backgrounds
  accent10: string;
  // 11 - Low-contrast text
  accent11: string;
  // 12 - High-contrast text
  accent12: string;
}

export default useTheme;
export {
  VARIATIONS as LEGACY_COLORS,
};
