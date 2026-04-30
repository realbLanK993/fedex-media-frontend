"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { briefingDateAtom } from "@/store/filterStore";
import { format, isToday, isYesterday, subDays } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { cn } from "@/lib/utils";

export default function PaperSelect() {
  const [date, setDate] = useAtom(briefingDateAtom);
  const [open, setOpen] = useState(false);

  const getLabel = () => {
    if (isToday(date)) return "Today's Briefing";
    if (isYesterday(date)) return "Yesterday's Briefing";
    return format(date, "PPP");
  };

  const presets = [
    { label: "Today", value: new Date() },
    { label: "Yesterday", value: subDays(new Date(), 1) },
    { label: "Last Week", value: subDays(new Date(), 7) },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "justify-start text-left font-light text-lg p-0 h-auto hover:bg-transparent border-0 shadow-none focus-visible:ring-0",
            !date && "text-muted-foreground"
          )}
        >
          {getLabel()}
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col border-b p-2">
          {presets.map((preset) => (
            <Button
              key={preset.label}
              variant="ghost"
              className="justify-start font-normal"
              onClick={() => {
                setDate(preset.value);
                setOpen(false);
              }}
            >
              {preset.label}
            </Button>
          ))}
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            if (d) {
              setDate(d);
              setOpen(false);
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
