import { useEffect } from 'react';

import { THEMES, THEME_MODES } from '../../utils/styles/colors/colorSystem';
import useStore from '../../utils/store';

export type PreferencesType = {
  [key: string]: string | boolean | number | THEMES | THEME_MODES | undefined;
  theme?: THEMES;
  themeMode?: THEME_MODES;
  isThemeModeSetByUser?: boolean;
  name?: string;
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

        if (pref) {
          setPref(key, pref);
        }
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
