import { StateCreator } from 'zustand';

import { PreferencesType } from '@modules/preferences/hooks';

export interface PreferencesSliceType {
  preferences: PreferencesType;
  setPreferences: (key: keyof PreferencesType, arg: PreferencesType[keyof PreferencesType]) => void;
}

const preferencesSlice: StateCreator<PreferencesSliceType> = (set) => ({
  preferences: {},
  setPreferences: (key, newPreferences) => set((state) => (
    {
      preferences: {
        ...state.preferences,
        [ key ]: newPreferences,
      },
    }
  )),
});

export default preferencesSlice;
