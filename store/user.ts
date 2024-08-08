import { create } from "zustand";

interface User {
  id: number;
  access_token?: string;
}

export interface UserStoreState {
  user: User | null;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserStoreState>()((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
}));
