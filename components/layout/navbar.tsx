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
import { useAtomValue, useSetAtom } from "jotai";
// import { isAuthenticatedAtom } from "@/store/authStore";
import { defaultFilterValues, filterAtom, isFilter } from "@/store/filterStore";
import FilterBar from "../articles/form";

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
  // const onLogout = async () => {
  //   await fetch("/api/auth/logout", {
  //     method: "POST",
  //   });
  //   setIsAuthenticated(false);
  // };
  if (minified) {
    return (
      <header className="p-4 border-b w-full bg-background">
        <div className="flex justify-between w-full">
          <div className="flex gap-2 justify-start items-center w-full">
            <input
              className="border-l-4 border-l-primary px-2"
              placeholder="Search"
            />
            <Search size={16} />
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
    <header className="p-4 border-b h-[220px] sticky top-0 bg-background">
      <div className="flex justify-between">
        <div className="flex gap-2 justify-start items-center">
          <input
            className="border-l-4 border-l-primary px-2"
            placeholder="Search"
          />
          <Search size={16} />
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
            <Link className="font-bold " href="/dashboard/home">
              HOME
            </Link>
          </li>
          <li>
            <Link href="/dashboard/analytics">ANALYTICS</Link>
          </li>
          <li className="flex flex-col gap-1">
            <Image src={"/logo.png"} width={160} height={160} alt="logo" />
            <span className="text-xl font-light">Media Presence</span>
          </li>
          <li>
            <Link href="/dashboard/newsletter">NEWSLETTER</Link>
          </li>
          <li>
            <Link className="flex gap-2 items-center" href="/dashboard/ai">
              <Sparkles size={16} />
              <span>ASK AI</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-primary text-sm">
            {new Date().toLocaleString("default", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p>
            <PaperSelect />
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            href={"/dashboard/settings"}
            className="flex justify-end text-secondary items-center gap-2 text-sm"
          >
            <Settings size={16} /> Settings
          </Link>
          <button className="flex gap-2 justify-end items-center cursor-pointer">
            <ListFilter size={16} />
            <FilterForm />
          </button>
        </div>
      </div>
    </header>
  );
}
