// app/ai-chat/page.tsx
"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  SendHorizonalIcon,
  UserIcon,
  BotIcon,
  Loader2,
  ExternalLinkIcon,
} from "lucide-react";
import Link from "next/link";
import { fetchChatResponse, ApiMetadata } from "@/lib/apiService";
import { useCommandPaletteStore } from "@/store/command-pallete";

const getUserId = (): string => {
  if (typeof window === "undefined") {
    // This should ideally not be hit if logic is structured well for client-side execution
    console.warn(
      "getUserId called when window is undefined. Returning placeholder."
    );
    return `ssr_placeholder_user_${crypto.randomUUID()}`;
  }
  let userId = window.localStorage.getItem("rag_user_id");
  if (!userId) {
    userId = `user_${crypto.randomUUID()}`;
    window.localStorage.setItem("rag_user_id", userId);
  }
  return userId;
};

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  metadata?: ApiMetadata[];
}

export default function AiChatPage() {
  const router = useRouter();
  const { initialAiQuery, setInitialAiQuery } = useCommandPaletteStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const initialQueryProcessedRef = useRef(false);

  useEffect(() => {
    // Set user ID once on mount (client-side only)
    if (typeof window !== "undefined") {
      setCurrentUserId(getUserId());
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const processQuery = async (query: string, isInitial: boolean = false) => {
    if (!currentUserId) {
      console.error(
        "processQuery called before currentUserId is set. Aborting."
      );
      setIsLoading(false);
      // Optionally, display an error message to the user in the chat
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        text: "Error: User session not initialized. Please refresh.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMsg]);
      return;
    }

    if (
      isInitial &&
      messages.length > 0 &&
      messages.some((m) => m.text === query && m.sender === "user")
    ) {
      console.log(
        "processQuery: Initial query already present as user message, skipping."
      );
      return;
    }
    console.log(
      `processQuery: Processing ${
        isInitial ? "initial" : "follow-up"
      } query for user ${currentUserId}:`,
      query
    );

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: query,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    if (!isInitial) setInputValue("");
    setIsLoading(true);

    try {
      const apiResponse = await fetchChatResponse({
        user_id: currentUserId,
        message: query,
      });

      const aiResponseMessage: Message = {
        id: crypto.randomUUID(),
        text: apiResponse.response,
        sender: "ai",
        timestamp: new Date(),
        metadata: apiResponse.metadata,
      };
      setMessages((prevMessages) => [...prevMessages, aiResponseMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessageText =
        error instanceof Error
          ? error.message
          : "Sorry, I encountered an error. Please try again.";
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        text: errorMessageText,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Process initial query from Zustand store, only if currentUserId is also set
    if (initialAiQuery && currentUserId && !initialQueryProcessedRef.current) {
      console.log(
        "useEffect[initialAiQuery, currentUserId]: Attempting to process initial query from Zustand:",
        initialAiQuery
      );
      processQuery(initialAiQuery, true);
      initialQueryProcessedRef.current = true;
      setInitialAiQuery(null); // Consume the query
    }
  }, [initialAiQuery, setInitialAiQuery, currentUserId]); // Dependencies

  useEffect(() => {
    // Reset processed flag if chat becomes empty (allowing a new initial query from store)
    if (messages.length === 0 && currentUserId) {
      console.log(
        "useEffect[messages, currentUserId]: Chat is empty, resetting initialQueryProcessedRef."
      );
      initialQueryProcessedRef.current = false;
    }
  }, [messages, currentUserId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !currentUserId) return;
    processQuery(inputValue.trim());
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="bg-card border-b p-4 flex items-center justify-between sticky top-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          asChild
        >
          <Link href="/" aria-label="Back to dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-lg font-semibold">AI Chat</h1>
        <div className="w-8"></div> {/* Spacer */}
      </header>

      <ScrollArea className="flex-grow p-4 md:p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "justify-end" : ""
              }`}
            >
              {msg.sender === "ai" && (
                <Avatar className="h-8 w-8 border flex-shrink-0">
                  <AvatarImage src="/placeholder-bot.jpg" alt="AI Avatar" />
                  <AvatarFallback>
                    <BotIcon className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`p-3 max-w-[85%] md:max-w-[75%] break-words ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </p>

                {msg.sender === "ai" &&
                  msg.metadata &&
                  msg.metadata.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-muted-foreground/20">
                      <p className="text-xs font-semibold mb-1 text-muted-foreground">
                        Sources:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.metadata.map((meta, index) => (
                          <a
                            key={index}
                            href={meta.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs"
                          >
                            <Badge
                              variant="secondary"
                              className="hover:bg-primary/20 transition-colors"
                            >
                              {meta.outlet || new URL(meta.url).hostname}
                              <ExternalLinkIcon className="ml-1.5 h-3 w-3" />
                            </Badge>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                <p className="text-xs text-muted-foreground/70 mt-2 text-right">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {msg.sender === "user" && (
                <Avatar className="h-8 w-8 border flex-shrink-0">
                  <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                  <AvatarFallback>
                    <UserIcon className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8 border flex-shrink-0">
                <AvatarFallback>
                  <BotIcon className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="p-3 bg-muted">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <footer className="bg-card border-t p-4 sticky bottom-0 z-10">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto flex items-center gap-2"
        >
          <Input
            type="text"
            placeholder="Ask a follow-up question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading || !currentUserId}
            className="flex-grow"
            autoFocus
          />
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim() || !currentUserId}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <SendHorizonalIcon className="h-5 w-5" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </footer>
    </div>
  );
}
