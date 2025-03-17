import { create, StateCreator } from 'zustand';

import { MODAL_TYPES } from '@modules/modal';
import { Room } from '@yappy/types';
import { preferencesSlice, PreferencesSliceType } from '@utils/store/slices';

type GeneralSlice = {
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

type Store = GeneralSlice & PreferencesSliceType;

/**
 * This slice contains state and actions that have yet to be reorganized into
 * their own relevant slices.
 */
const generalSlice: StateCreator<GeneralSlice> = (set) => ({
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

const useStore = create<Store>((...actions) => ({
  ...generalSlice(...actions),
  ...preferencesSlice(...actions),
}));

export default useStore;
