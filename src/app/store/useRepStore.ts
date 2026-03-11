import { create } from "zustand";
import { Rep } from "../lib/definitions";

type State = {
  reps: Rep[];
  activeRep: Rep | null;
  openRepIds: Set<string>;
};

type Action = {
  setReps: (newReps: State["reps"]) => void;
  setActiveRep: (newActiveRep: Rep | null) => void;
  toggleRepOpen: (bioguide: string) => void;
  isRepOpen: (bioguide: string) => boolean;
};

export const useRepStore = create<State & Action>((set, get) => ({
  reps: [],
  activeRep: null,
  openRepIds: new Set<string>(),
  setReps: (newReps) => set(() => ({ reps: newReps })),
  setActiveRep: (newActiveRep) =>
    set(() => ({ activeRep: newActiveRep })),
  toggleRepOpen: (bioguide) =>
    set((state) => {
      const next = new Set(state.openRepIds);
      if (next.has(bioguide)) next.delete(bioguide);
      else next.add(bioguide);
      return { openRepIds: next };
    }),
  isRepOpen: (bioguide) => get().openRepIds.has(bioguide),
}));
