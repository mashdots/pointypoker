import { create } from 'zustand';

import { MODAL_TYPES } from '@modules/modal';
import { PreferencesType } from '@modules/preferences/hooks';
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
};

const useStore = create<Store>((set) => ({
  arePrefsInitialized: false,
  clearRoom: () => set(() => ({ room: null })),
  currentModal: null,
  isMenuOpen: false,
  isTitleInputFocused: false,
  preferences: {},
  room: null,
  setCurrentModal: (newModal) => set(() => ({ currentModal: newModal })),
  setIsMenuOpen: (isOpen) => set(() => ({ isMenuOpen: isOpen })),
  setPreferences: (key, newPreferences) => set((state) => (
    {
      preferences: {
        ...state.preferences,
        [ key ]: newPreferences,
      },
    }
  )),
  setPrefsInitialized: () => set(() => ({ arePrefsInitialized: true })),
  setRoom: (newRoom) => set(() => ({ room: newRoom })),
  setTitleInputFocus: (isFocused) => set(() => ({ isTitleInputFocused: isFocused })),
}));

export default useStore;
