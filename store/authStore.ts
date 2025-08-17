import { UserWithMetadata } from "@/db/schema";
import { atom } from "jotai";

// type AuthStore = {
//   isAuthenticated: boolean | null;
//   userData: UserWithMetadata | null;
//   setIsAuthenticated: (e: boolean) => void;
//   setUserData: (e: UserWithMetadata) => void;
// };

// export const useAuthStore = create<AuthStore>((set) => ({
//   isAuthenticated: null,
//   userData: null,
//   setIsAuthenticated: (e: boolean) => set({ isAuthenticated: e }),
//   setUserData: (e: UserWithMetadata) => set({ userData: e }),
// }));

export const isAuthenticatedAtom = atom<boolean | null>(null);
export const userDataAtom = atom<UserWithMetadata | null>(null);
