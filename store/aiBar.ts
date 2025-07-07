import { create } from "zustand";

interface AiStore {
  AIenabled: boolean;
  ToggleAI: () => void;
}

export const useAiStore = create<AiStore>((set) => ({
  AIenabled: true,
  ToggleAI: () => set((state) => ({ AIenabled: !state.AIenabled })),
}));
