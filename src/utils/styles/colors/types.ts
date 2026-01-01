import * as colors from '@radix-ui/colors';

import { THEME_COLORS, THEMES } from './constants';

export type ColorCollectionType = keyof typeof colors;

export type Hue = Exclude<
  ColorCollectionType,
  'blackA'
    | 'blackP3A'
    | 'whiteA'
    | 'whiteP3A'
    | `${ keyof typeof colors }Dark`
    | `${ keyof typeof colors }DarkA`
    | `${ keyof typeof colors }A`
    | `${ keyof typeof colors }P3`
    | `${ keyof typeof colors }P3A`
    | `${ keyof typeof colors }DarkP3`
    | `${ keyof typeof colors }DarkP3A`
>;
export type SubColorReference = { [ key: string ]: string };

/**
 * REFERENCE ↴
 * https://www.radix-ui.com/docs/colors/palette-composition/understanding-the-scale
 */
export const VariationPropertyKeys = [
  // 1 - App background
  'accent1',
  // 2 - Subtle background
  'accent2',
  // 3 - Component backgrounds: normal state
  'accent3',
  // 4 - Component backgrounds: hover state
  'accent4',
  // 5 - Component backgrounds: pressed / selected state
  'accent5',
  // 6 - Borders: Subtle borders for non-interactive components
  'accent6',
  // 7 - Borders: Borders for interactive elements
  'accent7',
  // 8 - Borders: Borders for interactive elements in hover state
  'accent8',
  // 9 - Solid backgrounds
  'accent9',
  // 10 - Hovered solid backgrounds
  'accent10',
  // 11 - Low-contrast text
  'accent11',
  // 12 - High-contrast text
  'accent12',
] as const;

export type VariationPropertyKey = typeof VariationPropertyKeys[ number ];
export type VariationProperties = {
  [ key in VariationPropertyKey ]: string;
};

export type ThemeColorKey = typeof THEME_COLORS[number];


export type ThemeColors = {
  [ key in ThemeColorKey ]: Hue;
};

export type Theme = {
  [ key in ThemeColorKey | 'transparent' ]: VariationProperties;
};

export type ThemedProps = {
  theme: Theme;
  isNarrow?: boolean;
  colorTheme?: keyof Theme;
};

export type ThemeOption = {
  theme: THEMES,
  color: string;
};
