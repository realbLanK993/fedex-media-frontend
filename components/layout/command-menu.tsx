"use client";

import * as React from "react";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Home,
  LayoutDashboard,
  Newspaper,
  Sparkles,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { getTopTags, TopEntityItem } from "@/app/api-service";

interface CommandMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CommandMenu({ open, setOpen }: CommandMenuProps) {
  const router = useRouter();
  const [topics, setTopics] = React.useState<TopEntityItem[]>([]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  React.useEffect(() => {
    getTopTags(10).then((tags) => {
      if (tags) {
        setTopics(tags);
      }
    });
  }, []);

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/dashboard/home"))}
          >
            <Home className="mr-2 h-4 w-4" />
            <span>Home</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/dashboard/analytics"))}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Analytics</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/dashboard/newsletter"))}
          >
            <Newspaper className="mr-2 h-4 w-4" />
            <span>Newsletter</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/dashboard/ai"))}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Ask AI</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Topics">
          {topics.map((topic) => (
            <CommandItem
              key={topic.entity_text}
              onSelect={() =>
                runCommand(() =>
                  router.push(`/dashboard/topics/${encodeURIComponent(topic.entity_text)}`)
                )
              }
            >
              <Search className="mr-2 h-4 w-4" />
              <span>{topic.entity_text}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/dashboard/settings"))}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
