import { create } from "zustand";

export interface GroupStoreState {
  current: string | null;
  groups: any[];
  suggestions: any[];
  setCurrent: (id: string) => void;
  setGroups: (groups: any) => void;
  setSuggestions: (suggestion: any) => void;
}

export const useGroupStore = create<GroupStoreState>()((set) => ({
  current: null,
  groups: [],
  suggestions: [],
  setCurrent: (id) =>
    set(() => ({
      current: id,
    })),
  setGroups: (groups) => set(() => ({ groups })),
  setSuggestions: (suggestions) => set(() => ({ suggestions })),
}));
