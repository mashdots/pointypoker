import { useCallback, useEffect, useMemo } from 'react';
import * as colors from '@radix-ui/colors';

import { VariationProperties as ColorAssociation } from '.';
import * as themes from './themes';
import useStore from '../../store';

export enum THEMES {
  WHATEVER = 'whatever',
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

export enum THEME_MODE_CONTROLLER {
  SYSTEM = 'system',
  USER = 'user',
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

export type ThemeOption = {
  theme: string,
  color: string;
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
  const {
    selectedTheme,
    selectedThemeMode,
    setTheme,
    setThemeMode,
    isThemeModeSetBySystem,
    setIsThemeModeSetByUser,
  } = useStore(
    ({ preferences, setPreferences }) => (
      {
        selectedTheme: preferences?.theme,
        selectedThemeMode: preferences?.themeMode,
        isThemeModeSetBySystem: preferences?.themeModeController !== THEME_MODE_CONTROLLER.USER,
        setTheme: (newTheme: THEMES) => setPreferences('theme', newTheme),
        setThemeMode: (newThemeMode: THEME_MODES) => setPreferences('themeMode', newThemeMode),
        setIsThemeModeSetByUser: () => setPreferences('themeModeController', THEME_MODE_CONTROLLER.USER),
      }
    ),
  );

  const setThemeModeFromEvent = (e: MediaQueryListEvent) => setThemeMode(e.matches ? THEME_MODES.DARK : THEME_MODES.LIGHT);

  const themeMode = useMemo(
    () => selectedThemeMode ? selectedThemeMode : darkModePreference.matches ? THEME_MODES.DARK : THEME_MODES.LIGHT,
    [selectedThemeMode],
  );

  const theme = useMemo(
    () => {
      const finalTheme = selectedTheme ? selectedTheme : THEMES.WHATEVER;

      return buildTheme(themes[ finalTheme ], themeMode);
    },
    [selectedTheme, themeMode],
  );

  const themeOptions = useMemo(
    () => Object.values(THEMES).map((theme) => {
      const colors = buildTheme(themes[ theme ], themeMode);
      return {
        theme,
        color: colors.primary.solidBg,
      };
    }),
    [themeMode],
  );

  const toggleThemeMode = useCallback(() => {
    const newMode = themeMode === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT;

    darkModePreference.removeEventListener('change', setThemeModeFromEvent);
    setThemeMode(newMode);
    setIsThemeModeSetByUser();
  }, [themeMode]);

  /**
   * Connect the theme mode to the user's system preference.
  */
  useEffect(() => {
    if (isThemeModeSetBySystem) {
      setThemeModeFromEvent(darkModePreference as unknown as MediaQueryListEvent);
      darkModePreference.addEventListener('change', setThemeModeFromEvent);
    }

    return () => {
      darkModePreference.removeEventListener('change', setThemeModeFromEvent);
    };
  }, [isThemeModeSetBySystem]);

  return {
    theme,
    themeMode,
    setTheme,
    toggleThemeMode,
    themeOptions,
  };
};

export default useTheme;
