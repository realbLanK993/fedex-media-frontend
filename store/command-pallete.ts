// store/commandPaletteStore.ts
import { create } from "zustand";

interface CommandPaletteState {
  isOpen: boolean;
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;
  initialAiQuery: string | null; // New state for the query
  setInitialAiQuery: (query: string | null) => void; // Action to set it
}

export const useCommandPaletteStore = create<CommandPaletteState>((set) => ({
  isOpen: false,
  openPalette: () => set({ isOpen: true }),
  closePalette: () => set({ isOpen: false }),
  togglePalette: () => set((state) => ({ isOpen: !state.isOpen })),
  initialAiQuery: null, // Initialize as null
  setInitialAiQuery: (query) => set({ initialAiQuery: query }), // Setter
}));
