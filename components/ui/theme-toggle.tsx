"use client";

import { Button } from "./button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      suppressHydrationWarning
      variant={"outline"}
      onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
    >
      {theme == "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
