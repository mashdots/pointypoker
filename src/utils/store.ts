import { create } from 'zustand';

import { Room, User } from '../types';
import { THEMES, THEME_MODES } from './styles/colors/colorSystem';

type Store = {
  user: User | null;
  setUser: (arg: User) => void;
  clearUser: () => void;
  room: Room | null;
  setRoom: (arg: Room | null) => void;
  clearRoom: () => void;
  theme: THEMES | null;
  themeMode: THEME_MODES | null;
  setTheme: (arg: THEMES) => void;
  setThemeMode: (arg: THEME_MODES) => void;
}

const useStore = create<Store>((set) => ({
  user: null,
  setUser: (newUser) => set(() => ({ user: newUser })),
  clearUser: () => set(() => ({ user: null })),
  room: null,
  setRoom: (newRoom) => set(() => ({ room: newRoom })),
  clearRoom: () => set(() => ({ room: null })),
  theme: null,
  themeMode: null,
  setTheme: (newTheme) => set(() => ({ theme: newTheme })),
  setThemeMode: (newThemeMode) => set(() => ({ themeMode: newThemeMode })),
}));

export default useStore;
