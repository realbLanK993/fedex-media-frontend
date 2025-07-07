"use client";
import { Sparkles, Sun } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ThemeToggle from "../ui/theme-toggle";
import { useAiStore } from "@/store/aiBar";
export default function Navbar() {
  const toggleAI = useAiStore((state) => state.ToggleAI);
  return (
    <header className="p-4 border-b h-full max-h-[70px]">
      <nav className="flex justify-between gap-4">
        <span className="font-light text-2xl">FedEx Media Presence</span>
        <div className="flex gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={toggleAI} size={"icon"}>
                {" "}
                <Sparkles />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ask AI</p>
            </TooltipContent>
          </Tooltip>

          <ThemeToggle />
          <Button variant={"outline"}>Logout</Button>
        </div>
      </nav>
    </header>
  );
}
