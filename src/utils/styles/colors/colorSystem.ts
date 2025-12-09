import {
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import * as colors from '@radix-ui/colors';

import { VariationProperties as ColorAccents } from '.';
import useStore from '../../store';
import * as themes from './themes';

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

type ActualThemeMode = '' | 'Dark';

const ACTUAL_THEME_MODES = {
  [THEME_MODES.LIGHT]: '',
  [THEME_MODES.DARK]: 'Dark',
};

type ColorCollectionType = keyof typeof colors;
type Hue = Exclude<
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
type SubColorReference = { [ key: string ]: string };

export type ThemeColors = {
  [ key: string ]: Hue;
  primary: Hue;
  greyscale: Hue;
  success: Hue;
  warning: Hue;
  error: Hue;
  info: Hue;
};

export type Theme = {
  [ key: string ]: ColorAccents;
  primary: ColorAccents;
  greyscale: ColorAccents;
  transparent: ColorAccents;
  success: ColorAccents;
  warning: ColorAccents;
  error: ColorAccents;
  info: ColorAccents;
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

const variationPropertiesList: { dark: Array<keyof ColorAccents>,light: Array<keyof ColorAccents> } = {
  dark: [
    'accent1',
    'accent2',
    'accent3',
    'accent4',
    'accent5',
    'accent6',
    'accent7',
    'accent8',
    'accent9',
    'accent10',
    'accent11',
    'accent12',
  ],
  light: [
    'accent1',
    'accent2',
    'accent3',
    'accent4',
    'accent5',
    'accent6',
    'accent7',
    'accent8',
    'accent9',
    'accent10',
    'accent11',
    'accent12',
  ],
};

/**
 * Builds the expected color association structure for a given color scheme and mode.
 */
const buildColorAssociation = (
  color: Hue,
  mode: ActualThemeMode,
  isTransparent = false,
): ColorAccents => {
  const transparentModifier = isTransparent ? 'A' : '';
  const combinedColor: ColorCollectionType = `${color}${mode}${transparentModifier}`;
  const colorAssociation = {} as ColorAccents;
  const propertyListMode = mode === 'Dark' ? 'dark' : 'light';

  variationPropertiesList[propertyListMode].forEach((variationProperty, i) => {
    colorAssociation[variationProperty] = (colors[combinedColor] as SubColorReference)[`${color}${transparentModifier}${i + 1}`];
  });

  return colorAssociation;
};

const buildTheme = (theme: ThemeColors, mode: THEME_MODES): Theme => {
  const finalColorMode = ACTUAL_THEME_MODES[mode] as ActualThemeMode;
  const builtTheme = {} as Theme;

  for (const key in theme) {
    if ([
      'primary',
      'greyscale',
      'success',
      'warning',
      'error',
      'info',
    ].includes(key)) {
      builtTheme[key] = buildColorAssociation(theme[key] as Hue, finalColorMode);

      if (key === 'greyscale') {
        builtTheme.transparent = buildColorAssociation(
          theme[key] as Hue,
          finalColorMode,
          true,
        );
      }

    } else {
      throw new Error(`Invalid theme reference: ${key}. Check that your theme is properly structured.`);
    }
  }

  return builtTheme;
};

const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)');

const useTheme = () => {
  const {
    arePrefsInitialized,
    selectedTheme,
    selectedThemeMode,
    setTheme,
    setThemeMode,
    isThemeModeSetBySystem,
    setIsThemeModeSetByUser,
  } = useStore(({
    arePrefsInitialized,
    preferences,
    setPreferences,
  }) => (
    {
      arePrefsInitialized,
      isThemeModeSetBySystem: preferences?.themeModeController !== THEME_MODE_CONTROLLER.USER,
      selectedTheme: preferences?.theme,
      selectedThemeMode: preferences?.themeMode,
      setIsThemeModeSetByUser: () => setPreferences('themeModeController', THEME_MODE_CONTROLLER.USER),
      setTheme: (newTheme: THEMES) => setPreferences('theme', newTheme),
      setThemeMode: (newThemeMode: THEME_MODES) => setPreferences('themeMode', newThemeMode),
    }
  ));

  const setThemeModeFromEvent = (e: MediaQueryListEvent) => setThemeMode(e.matches ? THEME_MODES.DARK : THEME_MODES.LIGHT);

  const themeMode = useMemo(() => selectedThemeMode ? selectedThemeMode : darkModePreference.matches ? THEME_MODES.DARK : THEME_MODES.LIGHT, [selectedThemeMode]);

  const theme = useMemo(() => {
    const finalTheme = selectedTheme ? selectedTheme : THEMES.WHATEVER;

    return buildTheme(themes[ finalTheme ], themeMode);
  }, [selectedTheme, themeMode]);

  const themeOptions = useMemo(() => Object.values(THEMES).map((theme) => {
    const colors = buildTheme(themes[ theme ], themeMode);
    return {
      color: colors.primary.accent9,
      theme,
    };
  }), [themeMode]);

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
    if (arePrefsInitialized && isThemeModeSetBySystem) {
      setThemeModeFromEvent(darkModePreference as unknown as MediaQueryListEvent);
      darkModePreference.addEventListener('change', setThemeModeFromEvent);
    }

    return () => {
      darkModePreference.removeEventListener('change', setThemeModeFromEvent);
    };
  }, [arePrefsInitialized, isThemeModeSetBySystem]);

  return {
    setTheme,
    theme,
    themeMode,
    themeOptions,
    toggleThemeMode,
  };
};

export default useTheme;
