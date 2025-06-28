import { Sparkles, Sun } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
export default function Navbar() {
  return (
    <header className="p-4 border-b ">
      <nav className="flex justify-between gap-4">
        <span className="font-light text-2xl">Fedex Media Presence</span>
        <div className="flex gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size={"icon"}>
                {" "}
                <Sparkles />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ask AI</p>
            </TooltipContent>
          </Tooltip>

          <Button size={"icon"} variant={"outline"}>
            {" "}
            <Sun />
          </Button>
          <Button variant={"outline"}>Logout</Button>
        </div>
      </nav>
    </header>
  );
}
