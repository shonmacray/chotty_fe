import { create } from "zustand";

export interface GroupStoreState {
  current: string | null;
  groups: any[];
  setCurrent: (id: string) => void;
  setGroups: (groups: any) => void;
}

export const useGroupStore = create<GroupStoreState>()((set) => ({
  current: null,
  groups: [],
  setCurrent: (id) =>
    set(() => ({
      current: id,
    })),
  setGroups: (groups) => set(() => ({ groups })),
}));
