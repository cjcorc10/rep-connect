"use client";
import { createContext, useContext, ReactNode } from "react";
import { Rep } from "../lib/definitions";

type SelectedRepContextType = {
  selectedRep: Rep | null;
  setSelectedRep: (rep: Rep | null) => void;
};

const SelectedRepContext = createContext<
  SelectedRepContextType | undefined
>(undefined);

export function SelectedRepProvider({
  children,
  selectedRep,
  setSelectedRep,
}: {
  children: ReactNode;
  selectedRep: Rep | null;
  setSelectedRep: (rep: Rep | null) => void;
}) {
  return (
    <SelectedRepContext.Provider
      value={{ selectedRep, setSelectedRep }}
    >
      {children}
    </SelectedRepContext.Provider>
  );
}

export function useSelectedRep() {
  const context = useContext(SelectedRepContext);
  if (context === undefined) {
    throw new Error(
      "useSelectedRep must be used within a SelectedRepProvider"
    );
  }
  return context;
}
