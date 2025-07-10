"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAiStore } from "@/store/aiBar";
import { CircleQuestionMark, HistoryIcon, Send, X } from "lucide-react";

export default function AIBar() {
  const AIEnabled = useAiStore((state) => state.AIenabled);
  const toggleAI = useAiStore((state) => state.ToggleAI);
  return (
    AIEnabled && (
      <div className="w-[600px] flex flex-col justify-between h-screen p-4 border-l">
        <nav className="flex justify-between gap-2">
          <p className="text-xl">Ask AI</p>
          <div className="flex gap-2 justify-center items-center">
            <Button size={"icon"} variant={"ghost"}>
              <CircleQuestionMark size={18} />
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size={"icon"} variant={"ghost"}>
                  <HistoryIcon size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open Chat</p>
              </TooltipContent>
            </Tooltip>

            <Button onClick={toggleAI} size={"icon"} variant={"ghost"}>
              <X size={18} />
            </Button>
          </div>
        </nav>
        <div className="flex h-full flex-col justify-end gap-8">
          <ScrollArea className=" h-[calc(100vh-150px)]">
            <div className="flex flex-col gap-4">
              <div className="chat-1 flex justify-end w-full">
                <p className="max-w-[90%] border p-4 text-right">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                </p>
              </div>
              <div className="chat-2 flex justify-start w-full">
                <div className="max-w-[90%] bg-accent flex flex-col gap-4 text-accent-foreground border p-4 text-left">
                  <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Possimus magnam alias distinctio, quibusdam est esse error
                    cumque sed eius sequi, necessitatibus vitae iste quisquam
                    quidem, quia perferendis tempore odit. Consequuntur dicta
                    obcaecati in sapiente ab illum facere cupiditate accusamus.
                  </p>
                  <p>
                    Voluptatibus illum hic adipisci quam porro, earum tempora
                    numquam delectus necessitatibus eos vitae veniam, quas
                    magnam ratione voluptatem id consequuntur esse iure, autem
                    laudantium qui atque. Provident placeat iusto cupiditate
                    alias sapiente reprehenderit consectetur deleniti dolorem,
                    totam consequatur, laborum, est aspernatur labore
                    laudantium. Dicta odit nihil praesentium, iste officia nisi
                    asperiores? Cumque error atque porro debitis quo assumenda
                    accusantium eligendi laudantium!
                  </p>
                </div>
              </div>
              <div className="chat-1 flex justify-end w-full">
                <p className="max-w-[90%] border p-4 text-right">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                </p>
              </div>
              <div className="chat-2 flex justify-start w-full">
                <div className="max-w-[90%] bg-accent flex flex-col gap-4 text-accent-foreground border p-4 text-left">
                  <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Possimus magnam alias distinctio, quibusdam est esse error
                    cumque sed eius sequi, necessitatibus vitae iste quisquam
                    quidem, quia perferendis tempore odit. Consequuntur dicta
                    obcaecati in sapiente ab illum facere cupiditate accusamus.
                  </p>
                  <p>
                    Voluptatibus illum hic adipisci quam porro, earum tempora
                    numquam delectus necessitatibus eos vitae veniam, quas
                    magnam ratione voluptatem id consequuntur esse iure, autem
                    laudantium qui atque. Provident placeat iusto cupiditate
                    alias sapiente reprehenderit consectetur deleniti dolorem,
                    totam consequatur, laborum, est aspernatur labore
                    laudantium. Dicta odit nihil praesentium, iste officia nisi
                    asperiores? Cumque error atque porro debitis quo assumenda
                    accusantium eligendi laudantium!
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>
          <div className="flex gap-2">
            <Input className="w-full" />
            <Button variant={"outline"} size={"icon"}>
              <Send />
            </Button>
          </div>
        </div>
      </div>
    )
  );
}
