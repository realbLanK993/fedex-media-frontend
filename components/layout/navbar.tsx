"use client";
import {
  ChevronDown,
  ChevronUp,
  ListFilter,
  Search,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import ThemeToggle from "../ui/theme-toggle";
import Link from "next/link";
import Image from "next/image";
import PaperSelect from "./navbar-select";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import { CommandMenu } from "./command-menu";

import { useAtomValue, useSetAtom } from "jotai";
// import { isAuthenticatedAtom } from "@/store/authStore";
import { defaultFilterValues, filterAtom, isFilter, briefingDateAtom } from "@/store/filterStore";
import FilterBar from "../articles/form";
import { usePathname } from "next/navigation";
import { format } from "date-fns";



/** Pages where the global filter panel should be hidden */
const FILTER_HIDDEN_PATHS = [
  "/dashboard/clusters/",
  "/dashboard/article/",
];

const FilterForm = () => {
  const filterEnabled = useAtomValue(isFilter);
  const setFilters = useSetAtom(filterAtom);
  const [open, setOpen] = useState(false);

  const clearFilter = () => {
    setFilters({ ...defaultFilterValues });
  };
  return (
    <Drawer open={open} onOpenChange={setOpen} direction="left">
      <DrawerTrigger asChild>
        <p>Global Filter</p>
      </DrawerTrigger>

      <DrawerContent className="overflow-y-scroll w-fit">
        <DrawerHeader className="flex gap-2 flex-row justify-between">
          <DrawerTitle className="text-2xl font-light ">
            Global Filter
          </DrawerTitle>
          {filterEnabled && (
            <Button
              variant={"link"}
              onClick={() => {
                clearFilter();
                setOpen(false);
              }}
            >
              <X /> Clear Filters
            </Button>
          )}
        </DrawerHeader>
        <FilterBar open={open} setOpen={setOpen} />
      </DrawerContent>
    </Drawer>
  );
};


export default function Navbar() {
  // const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [minified, setMinified] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const pathname = usePathname();
  // const ai = useAtomValue(aiAtom);
  // const setAI = useSetAtom(aiAtom);
  const currentPage = (url: string) => {
    if (url.includes(pathname)) {
      return "font-bold"
    }
    return ""
  }

  const showFilter = !FILTER_HIDDEN_PATHS.some((p) => pathname.startsWith(p));

  const briefingDate = useAtomValue(briefingDateAtom);

  if (minified) {

    return (
      <header className="p-4 border-b w-full bg-background">
        <div className="flex justify-between w-full">
          <div className="flex gap-2 justify-start items-center w-full">
            <button
              onClick={() => setCommandOpen(true)}
              className="flex gap-2 justify-start items-center cursor-pointer group"
            >
              <div className="border-l-4 border-l-primary px-2 text-muted-foreground group-hover:text-foreground transition-colors">
                Search
              </div>
              <Search size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 ml-2">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          </div>
          <div>
            <Link href={"/dashboard/home"}>
              <Image
                className="w-full"
                src={"/logo.png"}
                width={100}
                height={100}
                alt="logo"
              />
            </Link>
          </div>
          <div className="flex gap-2 w-full justify-end">
            <ThemeToggle />
            <Button onClick={() => setMinified(false)} size={"icon"}>
              {" "}
              <ChevronDown />{" "}
            </Button>
          </div>
        </div>
      </header>
    );
  }
  return (
    <header className="p-4 border-b h-[220px] top-0 bg-background">
      <div className="flex justify-between">
        <div className="flex gap-2 justify-start items-center">
          <button
            onClick={() => setCommandOpen(true)}
            className="flex gap-2 justify-start items-center cursor-pointer group"
          >
            <div className="border-l-4 border-l-primary px-2 text-muted-foreground group-hover:text-foreground transition-colors">
              Search
            </div>
            <Search size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 ml-2">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>
        <div className="flex gap-2">
          <ThemeToggle />
          <Button onClick={() => setMinified(true)} size={"icon"}>
            {" "}
            <ChevronUp />{" "}
          </Button>
        </div>
      </div>
      <nav className="flex w-full justify-center">
        <ul className="flex gap-8 w-full justify-between text-lg font-light items-center max-w-7xl">
          <li>
            <Link className={currentPage("/dashboard/home")} href="/dashboard/home">
              HOME
            </Link>
          </li>
          <li>
            <Link className={currentPage("/dashboard/analytics")} href="/dashboard/analytics">ANALYTICS</Link>
          </li>
          <li className="flex flex-col gap-1">
            <Image src={"/logo.png"} width={160} height={160} alt="logo" />
            <span className="text-xl font-light">Media Presence</span>
          </li>
          <li>
            <Link className={currentPage("/dashboard/newsletter")} href="/dashboard/newsletter">NEWSLETTER</Link>
          </li>
          <li>
            <Link href="/dashboard/ai" className={`${currentPage("/dashboard/ai")} flex gap-2 items-center`}>
              <Sparkles size={16} />
              <span>ASK AI</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-primary text-sm">
            {/* {format(briefingDate, "EEEE, d MMMM yyyy")} */}
          </p>


          <p>
            <PaperSelect />
          </p>


        </div>
        {showFilter && (
          <div className="flex flex-col gap-2">
 <button className="flex gap-2 p-2 px-4 bg-accent justify-start items-center cursor-pointer">
              <ListFilter size={16} />
              <FilterForm />
            </button>
                                 </div>
        )}
      </div>
      <CommandMenu open={commandOpen} setOpen={setCommandOpen} />
    </header>
  );
}
