import { create } from 'zustand';

import { User } from '../types';

type Store = {
  user: User | null;
  setUser: (arg: User) => void;
  clearUser: () => void;
}

const useStore = create<Store>((set) => ({
  user: null,
  setUser: (newUser) => set(() => ({ user: newUser })),
  clearUser: () => set(() => ({ user: null })),
}));

export default useStore;
