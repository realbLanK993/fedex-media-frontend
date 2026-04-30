"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TimerResetIcon, ArrowUpIcon } from "lucide-react";

import { useEffect, useState, useRef, FormEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  UserIcon,
  BotIcon,
  Loader2,
  ExternalLinkIcon,
  Sparkles,
} from "lucide-react";
import { ApiMetadata, fetchChatResponse } from "@/app/api-service";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

const getUserId = (): string => {
  if (typeof window === "undefined") {
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

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUserId(getUserId());
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const processQuery = async (query: string) => {
    if (!currentUserId) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: query,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");
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

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading || !currentUserId) return;
    processQuery(inputValue.trim());
  };

  const exampleQueries = [
    "Generate a summary of our media presence for the past week.",
    "Show me all high-impact negative mentions from the last 48 hours. Specify reason for negative sentiment.",
    "Which logistics company is most associated with the term 'AI in Supply Chain' in media coverage over the past six months?"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] w-full mx-auto">
      {messages.length > 0 && (
        <header className="flex justify-between items-center px-8 py-4 border-b">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary h-5 w-5" />
            <h1 className="text-xl font-medium">Ask AI</h1>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setMessages([])}
                  size="icon"
                  variant="ghost"
                  className="rounded-full"
                >
                  <TimerResetIcon size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset Chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </header>
      )}

      {messages.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-3xl flex flex-col items-center">
            <h2 className="text-3xl font-light mb-8 text-[#4a4a4a] dark:text-gray-300">
              What can i help you with today?
            </h2>

            <div className="w-full relative shadow-sm rounded-lg border border-primary">
              <form onSubmit={handleSubmit} className="w-full">
                <textarea
                  placeholder="Ask AI anything"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isLoading || !currentUserId}
                  className="w-full h-32 p-6 pb-12 resize-none bg-transparent outline-none text-lg text-primary placeholder:text-primary/50 rounded-lg focus:ring-0 transition-all"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !inputValue.trim() || !currentUserId}
                  size="icon"
                  variant="ghost"
                  className="absolute bottom-4 right-4 rounded-full text-primary hover:text-primary hover:bg-primary/10"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <ArrowUpIcon className="h-6 w-6 border-2 border-current rounded-full p-1" />
                  )}
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </div>

            {/* <div className="w-full mt-8 flex flex-col items-start gap-4">
              <p className="text-sm font-semibold text-foreground">
                Example queries:
              </p>
              <div className="flex flex-col gap-3 w-full">
                {exampleQueries.map((query, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInputValue(query);
                    }}
                    className="text-left text-xs md:text-sm text-primary bg-transparent border border-dashed border-primary/50 rounded-full px-4 py-2 hover:bg-primary/5 transition-colors w-fit"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-grow px-8">
            <div className="max-w-4xl mx-auto space-y-6 py-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-4 ${msg.sender === "user" ? "justify-end" : ""
                    }`}
                >
                  {msg.sender === "ai" && (
                    <Avatar className="h-8 w-8 border flex-shrink-0 mt-1">
                      <AvatarImage src="/placeholder-bot.jpg" alt="AI Avatar" />
                      <AvatarFallback>
                        <BotIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`p-4 max-w-[85%] md:max-w-[75%] break-words rounded-xl ${msg.sender === "user"
                        ? "bg-primary/10 text-foreground"
                        : "bg-muted/50 text-foreground"
                      }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>

                    {msg.sender === "ai" &&
                      msg.metadata &&
                      msg.metadata.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-border/50">
                          <p className="text-xs font-semibold mb-2 text-muted-foreground">
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
                                  className="hover:bg-secondary/80 transition-colors py-1 px-2 font-normal text-muted-foreground"
                                >
                                  {meta.outlet || new URL(meta.url).hostname}
                                  <ExternalLinkIcon className="ml-1.5 h-3 w-3" />
                                </Badge>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    <p
                      className="text-[10px] mt-2 text-right text-muted-foreground/70"
                    >
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {msg.sender === "user" && (
                    <Avatar className="h-8 w-8 border flex-shrink-0 mt-1">
                      <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                      <AvatarFallback>
                        <UserIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-4">
                  <Avatar className="h-8 w-8 border flex-shrink-0 mt-1">
                    <AvatarFallback>
                      <BotIcon className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <footer className="p-4 bg-background border-t">
            <form
              onSubmit={handleSubmit}
              className="max-w-4xl mx-auto relative flex items-center"
            >
              <Input
                type="text"
                placeholder="Ask a follow-up question..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading || !currentUserId}
                className="flex-grow pr-12 rounded-full border-primary/20 focus-visible:ring-primary/50"
                autoFocus
              />
              <Button
                type="submit"
                disabled={isLoading || !inputValue.trim() || !currentUserId}
                size="icon"
                variant="ghost"
                className="absolute right-1 rounded-full text-primary hover:text-primary hover:bg-transparent"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ArrowUpIcon className="h-5 w-5 border-2 border-current rounded-full p-[2px]" />
                )}
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </footer>
        </>
      )}
    </div>
  );
}
