"use client";
import { Mail, Sparkles, Sun } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ThemeToggle from "../ui/theme-toggle";
// import { useAiStore } from "@/store/aiBar";
import Link from "next/link";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { aiAtom } from "@/store/temp-store";
import { isAuthenticatedAtom } from "@/store/authStore";
import { useRouter } from "next/navigation";
export default function OldNavbar() {
  const ai = useAtomValue(aiAtom);
  const setAI = useSetAtom(aiAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
  const router = useRouter();
  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    setIsAuthenticated(false);
    router.push("/login");
  };
  return (
    <header className="p-4 border-b h-full max-h-[70px]">
      <nav className="flex justify-between gap-4">
        <Link href={"/dashboard/home"}>
          <span className="font-light text-2xl">FedEx Media Presence</span>
        </Link>
        <div className="flex gap-4">
          {isAuthenticated && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => setAI(!ai)} size={"icon"}>
                  {" "}
                  <Sparkles />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ask AI</p>
              </TooltipContent>
            </Tooltip>
          )}
          <ThemeToggle />
          {isAuthenticated && (
            <Button onClick={logout} variant={"outline"}>
              Logout
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
