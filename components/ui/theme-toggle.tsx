"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const prefersDarkColorScheme = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    if (prefersDarkColorScheme) {
      setDark(true);
    }
  }, []);
  useEffect(() => {
    if (dark) {
      document.getElementsByTagName("html")[0].classList.add("dark");
    } else {
      document.getElementsByTagName("html")[0].classList.remove("dark");
    }
  }, [dark]);
  return (
    <Button variant={"outline"} onClick={() => setDark(!dark)}>
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}
