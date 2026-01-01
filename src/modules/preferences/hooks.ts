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

type GenericPrefType = string
  | boolean
  | number
  | THEMES
  | THEME_MODES
  | User
  | JiraAuthData
  | JiraResourceData
  | JiraPreferences
  | undefined
  | null;

export type PreferencesType = {
  [ key: string ]: GenericPrefType;
  isObserver?: boolean;
  jiraAccess?: JiraAuthData | null;
  jiraResources?: JiraResourceData | null;
  jiraPreferences?: JiraPreferences | null;
  name?: string;
  theme?: THEMES;
  themeMode?: THEME_MODES;
  themeModeController?: THEME_MODE_CONTROLLER;
  user?: User | null;
};

const PreferenceKeys = [
  'isObserver',
  'jiraAccess',
  'jiraResources',
  'jiraPreferences',
  'name',
  'theme',
  'themeMode',
  'themeModeController',
  'user',
];

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
      setPref: (key: string, pref: keyof PreferencesType) => setPreference(key, pref),
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
          setPref(key, pref);
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
        writeToLocalStorage(key, preferences[key]);
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
