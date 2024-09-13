import { create, StateCreator } from 'zustand';

import { PreferencesType } from '@modules/preferences/hooks';
import { MODAL_TYPES } from '@modules/modal';
import jiraSlice, { JiraStore } from '@modules/integrations/jira/store';
import { Room } from '@yappy/types';

type Store = {
  preferences: PreferencesType;
  setPreferences: (key: keyof PreferencesType, arg: PreferencesType[keyof PreferencesType] ) => void;
  room: Room | null;
  setRoom: (arg: Room | null) => void;
  clearRoom: () => void;
  isTitleInputFocused: boolean;
  setTitleInputFocus: (arg: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (arg: boolean) => void;
  currentModal: MODAL_TYPES | null;
  setCurrentModal: (arg: MODAL_TYPES | null) => void;
  arePrefsInitialized: boolean;
  setPrefsInitialized: () => void;
}

const defaultSlice: StateCreator<Store> = (set) => ({
  preferences: {},
  setPreferences: (key, newPreferences) => set((state) => (
    {
      preferences: {
        ...state.preferences,
        [ key ]: newPreferences,
      },
    }
  )),
  room: null,
  setRoom: (newRoom) => set(() => ({ room: newRoom })),
  clearRoom: () => set(() => ({ room: null })),
  isTitleInputFocused: false,
  setTitleInputFocus: (isFocused) => set(() => ({ isTitleInputFocused: isFocused })),
  isMenuOpen: false,
  setIsMenuOpen: (isOpen) => set(() => ({ isMenuOpen: isOpen })),
  currentModal: null,
  setCurrentModal: (newModal) => set(() => ({ currentModal: newModal })),
  arePrefsInitialized: false,
  setPrefsInitialized: () => set(() => ({ arePrefsInitialized: true })),
});

const useStore = create<Store & JiraStore>((...a) => ({
  ...defaultSlice(...a),
  ...jiraSlice(...a),
}));

export default useStore;
