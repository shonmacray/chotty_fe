import { create } from "zustand";

interface AccessToken {
  access_token?: string;
}

interface User {
  id: number;
}

export interface UserStoreState {
  user: (User & AccessToken) | null;
  setUser: (user: User & AccessToken) => void;
}

export const useUserStore = create<UserStoreState>()((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
}));
