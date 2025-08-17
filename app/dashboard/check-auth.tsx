"use client";

import Unauthenticated from "@/components/layout/unauthenticated";
import { isAuthenticatedAtom } from "@/store/authStore";
import { useAtomValue } from "jotai";

export default function CheckAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);

  return isAuthenticated ? children : <Unauthenticated />;
}
