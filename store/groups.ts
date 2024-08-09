import { create } from "zustand";

export interface Group {
  id: number;
  name: string;
  description: string;
  updated_at: string;
  created_at: string;
  User_group: UserGroups[];
}

interface UserGroups {
  id: number;
  group_id: number;
  user_id: number;
  created_at: string;
}

export interface GroupStoreState {
  current: number | null;
  groups: Group[];
  suggestions: Group[];
  setCurrent: (id: number) => void;
  setGroups: (groups: Group[]) => void;
  setSuggestions: (suggestion: Group[]) => void;
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
