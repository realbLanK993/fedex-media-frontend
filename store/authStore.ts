import { UsersSelect } from "@/db/schema";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  userData: null,
  setIsAuthenticated: (e: boolean) => set({ isAuthenticated: e }),
  setUserData: (e: Omit<UsersSelect, "passwordHash">) => set({ userData: e }),
}));
