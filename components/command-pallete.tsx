// components/AiCommandPalette.tsx
"use client";

import { useEffect, useState } from "react"; // Removed useCallback as functions are simpler now
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SearchIcon, BookText } from "lucide-react";
import { useCommandPaletteStore } from "@/store/command-pallete";

export function AiCommandPalette() {
  const router = useRouter();
  // Get setInitialAiQuery from the store
  const {
    isOpen,
    closePalette,
    openPalette,
    togglePalette,
    setInitialAiQuery,
  } = useCommandPaletteStore();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        togglePalette();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [togglePalette]);

  const navigateToChat = (query: string) => {
    if (query.trim()) {
      setInitialAiQuery(query.trim()); // <--- SET QUERY IN ZUSTAND
      closePalette();
      router.push(`/ai-chat`); // No need for query param anymore
      setInputValue("");
    }
  };

  const navigateToSummarize = (topic: string) => {
    if (topic.trim()) {
      setInitialAiQuery(topic.trim()); // <--- SET TOPIC (QUERY) IN ZUSTAND
      closePalette();
      router.push(`/summarize`); // No need for topic param anymore
      setInputValue("");
    }
  };

  const handleDialogClose = () => {
    closePalette();
    setInputValue("");
    // Optionally clear the initialAiQuery if dialog is closed without action
    // setInitialAiQuery(null); // Depends on desired behavior
  };

  // This handler is for when 'Enter' is pressed directly in the Input field.
  const handleInputSubmit = () => {
    if (inputValue.trim()) {
      console.log("Input field submitted with Enter, defaulting to chat.");
      navigateToChat(inputValue);
    }
  };

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleDialogClose();
        } else {
          openPalette();
        }
      }}
    >
      <CommandInput
        placeholder="Ask AI or type topic to summarize..."
        value={inputValue}
        onValueChange={setInputValue}
        // onKeyDown={(e) => {
        //   if (e.key === "Enter" && !e.nativeEvent.isComposing) {
        //     const activeElement = document.activeElement;
        //     if (activeElement === e.currentTarget && inputValue.trim()) {
        //       e.preventDefault();
        //       handleInputSubmit();
        //     }
        //   }
        // }}
      />
      <CommandList>
        <CommandEmpty>
          {inputValue.trim()
            ? "No specific actions. Press Enter to ask."
            : "Type your question or topic."}
        </CommandEmpty>
        {inputValue.trim() && (
          <CommandGroup heading="Actions">
            <CommandItem
              key="chat-action"
              onSelect={() => {
                console.log("Chat CommandItem selected.");
                navigateToChat(inputValue);
              }}
              value={`ask-${inputValue}`}
              className="cursor-pointer"
            >
              <SearchIcon className="mr-2 h-4 w-4" />
              <span>
                Ask: "
                {inputValue.length > 30
                  ? inputValue.substring(0, 30) + "..."
                  : inputValue}
                "
              </span>
            </CommandItem>
            <CommandItem
              key="summarize-action"
              onSelect={() => {
                console.log("Summarize CommandItem selected.");
                navigateToSummarize(inputValue);
              }}
              value={`summarize-${inputValue}`}
              className="cursor-pointer"
            >
              <BookText className="mr-2 h-4 w-4" />
              <span>
                Summarize Topic: "
                {inputValue.length > 20
                  ? inputValue.substring(0, 20) + "..."
                  : inputValue}
                "
              </span>
            </CommandItem>
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
