"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { isAuthenticatedAtom } from "@/store/authStore";
import Unauthenticated from "./layout/unauthenticated";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Provider, useAtom } from "jotai";

export const JotaiProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider>{children}</Provider>;
};
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [isPending, startTransition] = React.useTransition();
  useEffect(() => {
    startTransition(() => {
      fetch("/api/auth/validate")
        .then((res) => {
          if (res.ok) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        })
        .catch((err) => {
          console.error(
            `Something went wrong while fetching auth details\n`,
            err
          );
          setIsAuthenticated(false);
        });
    });
  }, []);

  if (isPending || isAuthenticated == null) {
    return (
      <div className="flex h-[calc(100vh-220px)] justify-center items-center gap-2">
        <Loader2 className="animate-spin" size={16} />
        <span>Fetching your data...</span>
      </div>
    );
  } else {
    if (isAuthenticated) {
      return children;
    } else return <Unauthenticated />;
  }
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      {...props}
      attribute="class"
      value={{
        light: "light",
        dark: "dark",
      }}
    >
      {children}
    </NextThemesProvider>
  );
}
