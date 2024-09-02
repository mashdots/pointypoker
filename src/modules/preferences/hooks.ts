import { useEffect } from 'react';

import { JiraAuthData, JiraPreferences, JiraResourceData } from '@modules/integrations/jira/types';
import { THEMES, THEME_MODES, THEME_MODE_CONTROLLER } from '@utils/styles/colors/colorSystem';
import useStore from '@utils/store';
import { User } from '@yappy/types';

export type PreferencesType = {
  [ key: string ]: string
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
  isObserver?: boolean;
  jiraAccess?: JiraAuthData;
  jiraResources?: JiraResourceData;
  jiraPreferences?: JiraPreferences;
  name?: string;
  theme?: THEMES;
  themeMode?: THEME_MODES;
  themeModeController?: THEME_MODE_CONTROLLER;
  user?: User | null;
}

const getPrefFromLocalStorage = (key: string): string | boolean | number | THEMES | THEME_MODES | undefined => {
  const storedPref = localStorage.getItem(key);
  if (storedPref) {
    return JSON.parse(storedPref);
  }
  return undefined;
};

const writeToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const purgeLocalStorage = () => {
  const storedPreferences = { ...localStorage };
  for (const key in storedPreferences) {
    localStorage.removeItem(key);
  }
};

const usePreferenceSync = () => {
  const { preferences, setPref, arePrefsInitialized, setPrefsInitialized } = useStore(
    ({ preferences, setPreferences, arePrefsInitialized, setPrefsInitialized }) => (
      {
        arePrefsInitialized,
        preferences,
        setPref: (key: string, pref: keyof PreferencesType) => setPreferences(key, pref),
        setPrefsInitialized,
      }
    ));

  const syncPrefsToStore = () => {
    const storedPreferences = { ...localStorage };
    let pref = null;

    for (const key in storedPreferences) {
      try {
        pref = JSON.parse(storedPreferences[ key ]);
        setPref(key, pref);
      } catch (error) {
        console.error('YIKES:', key, storedPreferences[ key ]);
      }
    }
  };

  // Imports preferences from localStorage to global state
  useEffect(() => {
    syncPrefsToStore();
    setPrefsInitialized();
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
    syncPrefsToStore,
    purgeLocalStorage,
  };
};

export default usePreferenceSync;
