import { useCallback, useEffect, useMemo } from 'react';
import * as colors from '@radix-ui/colors';

import { VariationProperties as ColorAssociation } from '.';
import * as themes from './themes';
import useStore from '../../store';
import usePreferenceSync from '../../../modules/preferences/hooks';

export enum THEMES {
  MAIN = 'main',
  BLUEBERRY = 'blueberry',
  DIRT = 'dirt',
  GRAPE = 'grape',
  MINT = 'mint',
  ORANGE = 'orange',
  STRAWBERRY = 'strawberry',
}

export enum THEME_MODES {
  DARK = 'dark',
  LIGHT = 'light',
}

type ActualThemeMode = '' | 'Dark'

const ACTUAL_THEME_MODES = {
  [THEME_MODES.LIGHT]: '',
  [THEME_MODES.DARK]: 'Dark',
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
  [ key: string ]: LightColorReference;
  primary: LightColorReference;
  greyscale: LightColorReference;
  success: LightColorReference;
  warning: LightColorReference;
  error: LightColorReference;
  info: LightColorReference;
};

export type Theme = {
  [ key: string ]: ColorAssociation;
  primary: ColorAssociation;
  greyscale: ColorAssociation;
  transparent: ColorAssociation;
  success: ColorAssociation;
  warning: ColorAssociation;
  error: ColorAssociation;
  info: ColorAssociation;
};

export type ThemedProps = {
  theme: Theme;
};

const variationPropertiesList = [
  'bg',
  'bgAlt',
  'componentBg',
  'componentBgHover',
  'componentBgActive',
  'border',
  'borderElement',
  'borderElementHover',
  'solidBg',
  'solidBgHover',
  'textLow',
  'textHigh',
];

/**
 * Builds the expected color association structure for a given color scheme and mode.
 */
const buildColorAssociation = (color: LightColorReference, mode: ActualThemeMode, isTransparent = false): ColorAssociation => {
  const transparentModifier = isTransparent ? 'A' : '';
  const combinedColor: ColorReference = `${color}${mode}${transparentModifier}`;
  const colorAssociation = {} as ColorAssociation;

  variationPropertiesList.forEach((variationProperty, i) => {
    colorAssociation[variationProperty] = (colors[combinedColor] as SubColorReference)[`${color}${transparentModifier}${i + 1}`];
  });

  return colorAssociation;
};

const buildTheme = (theme: ThemeReference, mode: THEME_MODES): Theme => {
  const finalColorMode = ACTUAL_THEME_MODES[mode] as ActualThemeMode;
  const builtTheme = {} as Theme;

  for (const key in theme) {
    if (['primary', 'greyscale', 'success', 'warning', 'error', 'info'].includes(key) && theme[key]) {
      builtTheme[key] = buildColorAssociation(theme[key] as LightColorReference, finalColorMode);

      if (key === 'greyscale') {
        builtTheme.transparent = buildColorAssociation(theme[key] as LightColorReference, finalColorMode, true);
      }

    } else {
      throw new Error(`Invalid theme reference: ${key}. Check that your theme is properly structured.`);
    }
  }

  return {
    ...builtTheme,
  };
};

const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)');

const useTheme = () => {
  const { getPrefFromLocalStorage } = usePreferenceSync();
  const {
    selectedTheme,
    themeMode,
    setTheme,
    setThemeMode,
    isThemeModeSetByUser,
    setIsThemeModeSetByUser,
  } = useStore(
    ({ preferences, setPreferences }) => (
      {
        selectedTheme: preferences?.theme,
        themeMode: preferences?.themeMode,
        isThemeModeSetByUser: preferences?.isThemeModeSetByUser,
        setTheme: (newTheme: THEMES) => setPreferences('theme', newTheme),
        setThemeMode: (newThemeMode: THEME_MODES) => setPreferences('themeMode', newThemeMode),
        setIsThemeModeSetByUser: (isIt: boolean) => setPreferences('isThemeModeSetByUser', isIt),
      }
    ),
  );

  const setThemeModeFromEvent = (e: MediaQueryListEvent) => setThemeMode(e.matches ? THEME_MODES.DARK : THEME_MODES.LIGHT);

  const theme = useMemo(
    () => {
      let finalTheme = selectedTheme;
      let finalThemeMode = themeMode;

      if (!finalTheme) {
        const storedTheme = getPrefFromLocalStorage('theme');
        // If there is no theme in state, check localStorage
        if (storedTheme) {
          finalTheme = <THEMES> storedTheme;
        } else {
          // Otherwise, default to the main theme
          finalTheme = THEMES.MAIN;
        }

        setTheme(finalTheme);
      }

      if (!finalThemeMode) {
        const storedThemeMode = getPrefFromLocalStorage('themeMode');
        // If there is no theme mode in state, check localStorage
        if (storedThemeMode) {
          finalThemeMode = <THEME_MODES> storedThemeMode;
        } else {
          // Otherwise, default to the user's system preference
          finalThemeMode = darkModePreference.matches ? THEME_MODES.DARK : THEME_MODES.LIGHT;
        }
        setThemeMode(finalThemeMode);
      }

      return buildTheme(themes[finalTheme as THEMES], finalThemeMode as THEME_MODES);
    },
    [selectedTheme, themeMode],
  );

  const toggleThemeMode = useCallback(() => {
    const newMode = themeMode === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT;

    darkModePreference.removeEventListener('change', setThemeModeFromEvent);
    setThemeMode(newMode);
    setIsThemeModeSetByUser(true);
  }, [themeMode, isThemeModeSetByUser]);

  /**
   * Connect the theme mode to the user's system preference.
  */
  useEffect(() => {
    const storedIsThemeModeSetByUser = getPrefFromLocalStorage('isThemeModeSetByUser');

    if (!storedIsThemeModeSetByUser) {
      darkModePreference.addEventListener('change', setThemeModeFromEvent);
    }

    return () => {
      darkModePreference.removeEventListener('change', setThemeModeFromEvent);
    };
  }, []);

  return {
    theme,
    themeMode,
    setTheme,
    toggleThemeMode,
  };
};

export default useTheme;
