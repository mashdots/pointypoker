import { create } from 'zustand';

import { User } from '../types';

type Store = {
  user: User | null;
  setUser: (arg: User) => void;
  clearUser: () => void;
  room: string | null;
  setRoom: (arg: string) => void;
  clearRoom: () => void;
}

const useStore = create<Store>((set) => ({
  user: null,
  setUser: (newUser) => set(() => ({ user: newUser })),
  clearUser: () => set(() => ({ user: null })),
  room: null,
  setRoom: (newRoom) => set(() => ({ room: newRoom })),
  clearRoom: () => set(() => ({ room: null })),
}));

export default useStore;
