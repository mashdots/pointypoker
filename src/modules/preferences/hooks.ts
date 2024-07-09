import { useEffect } from 'react';

import { THEMES, THEME_MODES, THEME_MODE_CONTROLLER } from '../../utils/styles/colors/colorSystem';
import useStore from '../../utils/store';
import { User } from '../../types';

export type PreferencesType = {
  [key: string]: string | boolean | number | THEMES | THEME_MODES | User | undefined | null;
  theme?: THEMES;
  themeMode?: THEME_MODES;
  themeModeController?: THEME_MODE_CONTROLLER;
  name?: string;
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
  const { preferences, setPref } = useStore(({ preferences, setPreferences }) => (
    { preferences, setPref: (key: string, pref: keyof PreferencesType) => setPreferences(key, pref) }
  ));

  // Imports preferences from localStorage to global state
  useEffect(() => {
    const storedPreferences = { ...localStorage };
    let pref = null;

    for (const key in storedPreferences) {
      try {
        pref = JSON.parse(storedPreferences[key]);
        setPref(key, pref);
      } catch (error) {
        console.error('Error parsing stored preference:', key, storedPreferences[key]);
      }
    }
  }, []);

  // Write to localStorage when preferences change
  useEffect(() => {
    for (const key in preferences) {
      writeToLocalStorage(key, preferences[key]);
    }
  }, [preferences]);

  return {
    getPrefFromLocalStorage,
    purgeLocalStorage,
  };
};

export default usePreferenceSync;
