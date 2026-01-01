import {
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import * as colors from '@radix-ui/colors';
import flags from '@utils/flags';
import {
  ColorCollectionType,
  Hue,
  SubColorReference,
  Theme,
  ThemeColorKey,
  ThemeColors,
} from '@utils/styles/colors/types';

import { VariationProperties as ColorAccents } from '.';
import useStore from '../../store';
import * as themes from './constants';
import { THEMES, THEME_COLORS } from './constants';

type HookReturnType = {
  setTheme: (theme: THEMES) => void;
  theme: Theme;
  themeMode: THEME_MODES;
  themeOptions: ThemeOption[];
  toggleThemeMode: () => void;
};

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

export type ThemeOption = {
  theme: THEMES,
  color: string;
};

const variationPropertiesList: {
  dark: Array<keyof ColorAccents>,
  light: Array<keyof ColorAccents>
} = {
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
    // eslint-disable-next-line @stylistic/max-len
    colorAssociation[variationProperty] = (colors[combinedColor] as SubColorReference)[`${color}${transparentModifier}${i + 1}`];
  });

  return colorAssociation;
};

const buildTheme = (
  theme: ThemeColors,
  mode: THEME_MODES,
  isInV4Experience: boolean = false,
): Theme => {
  const finalColorMode = ACTUAL_THEME_MODES[mode] as ActualThemeMode;
  const builtTheme = {} as Theme;

  if (isInV4Experience) {
    console.log('V4 theme building');
  }

  for (const [colorKey, hue] of Object.entries(theme)) {
    const finalColorKey = colorKey as ThemeColorKey;

    if (!THEME_COLORS.includes(finalColorKey)) {
      throw new Error(`Invalid theme reference: ${finalColorKey}. Check that your theme is properly structured.`);
    }

    builtTheme[ finalColorKey ] = buildColorAssociation(hue, finalColorMode);

    if (finalColorKey === 'greyscale') {
      builtTheme.transparent = buildColorAssociation(
        hue,
        finalColorMode,
        true,
      );
    }

    // builtTheme[ finalColorKey === 'greyscale' ? 'transparent' : finalColorKey ] = buildColorAssociation(
    //   hue,
    //   finalColorMode,
    //   finalColorKey === 'greyscale',
    // );
  }

  return builtTheme;
};

const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)');

const useTheme = (): HookReturnType => {
  const {
    arePrefsInitialized,
    selectedTheme,
    selectedThemeMode,
    setTheme,
    setThemeMode,
    isThemeModeSetBySystem,
    setIsThemeModeSetByUser,
    isInV4Experience,
  } = useStore(({
    arePrefsInitialized,
    preferences,
    setPreference,
    getFlag,
  }) => (
    {
      arePrefsInitialized,
      isInV4Experience: getFlag(flags.REDESIGN),
      isThemeModeSetBySystem: preferences?.themeModeController !== THEME_MODE_CONTROLLER.USER,
      selectedTheme: preferences?.theme,
      selectedThemeMode: preferences?.themeMode,
      setIsThemeModeSetByUser: () => setPreference('themeModeController', THEME_MODE_CONTROLLER.USER),
      setTheme: (newTheme: THEMES) => setPreference('theme', newTheme),
      setThemeMode: (newThemeMode: THEME_MODES) => setPreference('themeMode', newThemeMode),
    }
  ));

  const setThemeModeFromEvent = useCallback((e: MediaQueryListEvent) =>
    setThemeMode(e.matches ? THEME_MODES.DARK : THEME_MODES.LIGHT), [setThemeMode]);

  const themeMode = useMemo(() => selectedThemeMode
    ? selectedThemeMode
    : darkModePreference.matches
      ? THEME_MODES.DARK
      : THEME_MODES.LIGHT, [selectedThemeMode] );

  const theme = useMemo(() => {
    const finalTheme = selectedTheme ?? THEMES.WHATEVER;

    return buildTheme(
      themes[ finalTheme ],
      themeMode,
      isInV4Experience,
    );
  }, [
    selectedTheme,
    themeMode,
    isInV4Experience,
  ]);

  const themeOptions: ThemeOption[] = useMemo(() => Object.values(THEMES).map((theme) => {
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
  }, [
    setIsThemeModeSetByUser,
    setThemeMode,
    setThemeModeFromEvent,
    themeMode,
  ]);

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
