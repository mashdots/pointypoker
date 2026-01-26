import { useEffect } from 'react';

import {
  JiraAuthData,
  JiraPreferences,
  JiraResourceData,
} from '@modules/integrations/jira/types';
import useStore from '@utils/store';
import {
  THEME_MODE_CONTROLLER,
  THEME_MODES,
} from '@utils/styles/colors/colorSystem';
import { THEMES } from '@utils/styles/colors/constants';
import { User } from '@yappy/types';
import { PointScheme } from '@yappy/types/estimation';

const PreferenceKeys = [
  'isObserver',
  'jiraAccess',
  'jiraResources',
  'jiraPreferences',
  'name',
  'pointScheme',
  'theme',
  'themeMode',
  'themeModeController',
  'user',
];

type GenericPrefType = string
  | boolean
  | THEMES
  | THEME_MODES
  | User
  | JiraAuthData
  | JiraResourceData
  | JiraPreferences
  | PointScheme
  | undefined
  | null;

export type PreferencesType = {
  isObserver?: boolean;
  jiraAccess?: JiraAuthData | null;
  jiraResources?: JiraResourceData | null;
  jiraPreferences?: JiraPreferences | null;
  name?: string;
  pointScheme?: PointScheme;
  theme?: THEMES;
  themeMode?: THEME_MODES;
  themeModeController?: THEME_MODE_CONTROLLER;
  user?: User | null;
};

const getPrefFromLocalStorage = (key: string): GenericPrefType | undefined => {
  const storedPref = localStorage.getItem(key);
  if (storedPref) {
    return JSON.parse(storedPref);
  }
  return undefined;
};

const writeToLocalStorage = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const purgeLocalStorage = () => {
  const storedPreferences = { ...localStorage };
  for (const key in storedPreferences) {
    localStorage.removeItem(key);
  }
};

const usePreferenceSync = () => {
  const {
    preferences,
    setPref,
    arePrefsInitialized,
    setPrefsInitialized,
  } = useStore(({
    preferences,
    setPreference,
    arePrefsInitialized,
    setPrefsInitialized,
  }) => (
    {
      arePrefsInitialized,
      preferences,
      setPref: (key: keyof PreferencesType, pref: GenericPrefType) => setPreference(key, pref),
      setPrefsInitialized,
    }
  ));

  const syncPrefsToStore = () => {
    const storedPreferences = { ...localStorage };
    let pref = null;

    for (const key of Object.keys(storedPreferences)) {
      try {
        if (PreferenceKeys.includes(key)) {
          pref = JSON.parse(storedPreferences[ key ]);
          setPref(key as keyof PreferencesType, pref);
        }
      } catch (error: unknown) {
        console.error(
          `YIKES: ${ (error as SyntaxError).message } while parsing preference key from localStorage:`,
          key,
          storedPreferences[ key ],
        );
      }
    }
  };

  // Imports preferences from localStorage to global state
  useEffect(() => {
    syncPrefsToStore();
    setPrefsInitialized();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Write to localStorage when preferences change
  useEffect(() => {
    if (arePrefsInitialized) {
      for (const key in preferences) {
        const storedPref = getPrefFromLocalStorage(key);

        if (JSON.stringify(storedPref) === JSON.stringify(preferences[key as keyof PreferencesType])) {
          continue;
        }
        const preference: GenericPrefType = preferences[key as keyof PreferencesType];
        writeToLocalStorage(key, preference);
      }
    }
  }, [arePrefsInitialized, preferences]);

  return {
    getPrefFromLocalStorage,
    purgeLocalStorage,
    syncPrefsToStore,
  };
};

export default usePreferenceSync;
