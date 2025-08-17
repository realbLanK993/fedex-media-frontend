// components/PaperSelect.tsx

"use client";

import { useState } from "react";
import { Select, SelectContent, SelectTrigger, SelectItem } from "../ui/select"; // Make sure SelectContent is imported

export default function PaperSelect() {
  const [value, setValue] = useState("today");
  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="border-0 shadow-none w-full p-0 outline-none bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent focus-visible:ring-0 text-lg font-light">
        <p className="text-foreground ">
          {value == "today"
            ? "Today"
            : value == "yesterday"
            ? "Yesterday"
            : "Last Week"}{" "}
        </p>
      </SelectTrigger>
      <SelectContent className="">
        <SelectItem value="today">{`Today\'s Paper`}</SelectItem>
        <SelectItem value="yesterday">{`Yesterday\'s Paper`}</SelectItem>
        <SelectItem value="lastweek"> {`Last Week\'s Paper`} </SelectItem>
      </SelectContent>
    </Select>
  );
}
