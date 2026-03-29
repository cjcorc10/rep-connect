import { create } from "zustand";
import { Rep } from "../lib/definitions";

type State = {
  reps: Rep[];
  activeRep: Rep | null;
  detailBioguideId: string | null;
};

type Action = {
  setReps: (newReps: State["reps"]) => void;
  getReps: () => Rep[];
  setActiveRep: (newActiveRep: Rep | null) => void;
  toggleRepDetail: (bioguide: string) => void;
  closeRepDetail: () => void;
};

export const useRepStore = create<State & Action>((set, get) => ({
  reps: [],
  activeRep: null,
  detailBioguideId: null,
  setReps: (newReps) => set(() => ({ reps: newReps })),
  getReps: () => get().reps,
  setActiveRep: (newActiveRep) =>
    set(() => ({ activeRep: newActiveRep })),
  toggleRepDetail: (bioguide) =>
    set((state) => ({
      detailBioguideId:
        state.detailBioguideId === bioguide ? null : bioguide,
    })),
  closeRepDetail: () => set(() => ({ detailBioguideId: null })),
}));
