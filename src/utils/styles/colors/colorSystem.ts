import { useMemo } from 'react';
import * as colors from '@radix-ui/colors';

import { VariationProperties as ColorAssociation } from '.';
import * as themes from './themes';
import useStore from '../../store';

export enum THEMES {
  MAIN = 'main',
  BLUEBERRY = 'blueberry',
  DIRT = 'dirt',
  GRAPE = 'grape',
  MINT = 'mint',
  ORANGE = 'orange',
  STRAWBERRY = 'strawberry',
}

/**
 * Title case makes it easy to reference the dark alternates in colors.
 */
export enum THEME_MODES {
  DARK = 'dark',
  LIGHT = 'light',
}

type ActualThemeMode = '' | 'Dark'

const ACTUAL_THEME_MODES = {
  [THEME_MODES.LIGHT]: '',
  [THEME_MODES.DARK]: THEME_MODES.DARK,
};

type ColorReference = keyof typeof colors;
/**
 * So we can properly calculate the color associations based on whether or not the theme is dark, we need to omit color
 * references that are already dark, 'A', or 'DarkA' alternatives.
 */
type LightColorReference = Exclude<
  ColorReference,
  'blackA' | 'whiteA' | `${ keyof typeof colors }Dark` | `${ keyof typeof colors }DarkA` | `${ keyof typeof colors }A`
>;
type SubColorReference = { [ key: string ]: string };

export type ThemeReference = {
  [ key: string ]: LightColorReference | { [ key: string ]: LightColorReference };
  primary: LightColorReference;
  greyScale: LightColorReference;
  functional: {
    success: LightColorReference;
    warning: LightColorReference;
    error: LightColorReference;
    info: LightColorReference;
  }
};

type Theme = {
  [ key: string ]: ColorAssociation | { [ key: string ]: ColorAssociation };
  primary: ColorAssociation;
  greyScale: ColorAssociation;
  functional: {
    success: ColorAssociation;
    warning: ColorAssociation;
    error: ColorAssociation;
    info: ColorAssociation;
  }
};

const variationPropertiesList = [
  'bg',
  'bgAlt',
  'bgElement',
  'bgElementHover',
  'bgElementActive',
  'border',
  'borderElement',
  'borderElementHover',
  'solidBg',
  'hoverSolidBg',
  'textLowContrast',
  'textHighContrast',
];

/**
 * Builds the expected color association structure for a given color scheme and mode.
 */
const buildColorAssociation = (color: LightColorReference, mode: ActualThemeMode): ColorAssociation => {
  const combinedColor: ColorReference = `${color}${mode}`;
  const colorAssociation = {} as ColorAssociation;

  variationPropertiesList.forEach((variationProperty, i) => {
    colorAssociation[variationProperty] = (colors[combinedColor] as SubColorReference)[`${color}${i + 1}`];
  });

  return colorAssociation;
};

const buildTheme = (theme: ThemeReference, mode: THEME_MODES): Theme => {
  const { primary: p, greyScale: g, functional: f } = theme;
  const finalColorMode = ACTUAL_THEME_MODES[mode] as ActualThemeMode;

  const primary = buildColorAssociation(p, finalColorMode);
  const greyScale = buildColorAssociation(g, finalColorMode);
  const functional = {
    success: buildColorAssociation(f.success, finalColorMode),
    warning: buildColorAssociation(f.warning, finalColorMode),
    error: buildColorAssociation(f.error, finalColorMode),
    info: buildColorAssociation(f.info, finalColorMode),
  };

  return {
    primary,
    greyScale,
    functional,
  };
};

const useTheme = () => {
  const {
    selectedTheme,
    themeMode,
    setTheme,
    setThemeMode,
  } = useStore(
    ({ theme: selectedTheme, themeMode, setTheme, setThemeMode }) => (
      { selectedTheme, themeMode, setTheme, setThemeMode }
    ),
  );

  const theme = useMemo(
    () => {
      let finalTheme = selectedTheme;
      let finalThemeMode = themeMode;

      if (!selectedTheme) {
        finalTheme = THEMES.MAIN;
        setTheme(finalTheme);
      }

      if (!themeMode) {
        finalThemeMode = THEME_MODES.LIGHT;
        setThemeMode(THEME_MODES.LIGHT);
      }

      return buildTheme(themes[finalTheme as THEMES], finalThemeMode as THEME_MODES);
    },
    [selectedTheme, themeMode],
  );

  return {
    theme,
    themeMode,
    setTheme,
    setThemeMode,
  };
};

export default useTheme;
