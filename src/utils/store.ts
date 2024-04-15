import { create } from 'zustand';

import { Room, User } from '../types';

type Store = {
  user: User | null;
  setUser: (arg: User) => void;
  clearUser: () => void;
  room: Room | null;
  setRoom: (arg: Room) => void;
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
