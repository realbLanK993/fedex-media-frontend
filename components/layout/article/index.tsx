"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Filter, HardDriveDownload, Mail, X } from "lucide-react";
import FilterForm from "@/components/articles/form";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import {
  articleDataAtom,
  defaultFilterValues,
  filterAtom,
  isFilter,
} from "@/store/filterStore";
import Link from "next/link";
import { downloadJsonAsCsv } from "@/lib/utils";
import { atom, useAtomValue, useSetAtom } from "jotai";

export default function ArticleNavbar() {
  const articleCountAtom = atom((get) => {
    const data = get(articleDataAtom);
    return data ? data.length : 0;
  });
  const articleCount = useAtomValue(articleCountAtom);
  const [open, setOpen] = useState(false);
  const filterEnabled = useAtomValue(isFilter);
  const data = useAtomValue(articleDataAtom);
  const clear = useSetAtom(filterAtom);
  const clearFilter = () => {
    clear({ ...defaultFilterValues });
  };
  const handleDownloadCsv = () => {
    // You can choose to download all articles or just the filtered ones
    // For filtered articles:
    if (data && data.length > 0) {
      // Example: Define custom headers if you want a specific order or naming
      const customHeaders = [
        "headline",
        "outlet",
        "date",
        "country",
        "sentiment",
        "summary",
        "keyword",
        "financial_performance", // These will be 0 or 1
        "innovation",
        "regulatory",
        "environment_responsibility",
        "social_responsibility",
        "community_responsibility",
        "e_commerce",
        "hyperlink",
      ];
      // Or, to use all keys from the first object as headers (default behavior of the function if customHeaders is omitted):
      // downloadJsonAsCsv(filteredArticles, "media_presence_report.csv");

      downloadJsonAsCsv(data, "media_presence_report.csv", customHeaders);
    } else {
      alert("No articles to download based on current filters.");
    }
  };
  return (
    <div className="flex gap-4 max-h-[60px] w-full justify-between items-center">
      <p className="font-semibold ">{articleCount} Articles Found</p>
      <div className="flex gap-2">
        {filterEnabled && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={clearFilter} variant={"outline"} size={"sm"}>
                Clear <X />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear Filter</p>
            </TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Link className=" cursor-pointer " href={"/dashboard/newsletter"}>
              {" "}
              <Button size={"sm"}>
                <Mail />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Newsletter</p>
          </TooltipContent>
        </Tooltip>

        <Dialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button variant={"outline"} size={"sm"}>
                  <HardDriveDownload />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download as CSV</p>
            </TooltipContent>
          </Tooltip>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Download as CSV</DialogTitle>
              <DialogDescription>
                Download your filtered articles as a CSV file with just one
                click! Export now to save or analyze your data.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={handleDownloadCsv}>Download</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Drawer open={open} onOpenChange={setOpen} direction="left">
          <Tooltip>
            <TooltipTrigger asChild>
              <DrawerTrigger asChild>
                <Button
                  variant={filterEnabled ? "default" : "outline"}
                  size={"sm"}
                >
                  <Filter />
                </Button>
              </DrawerTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Filter</p>
            </TooltipContent>
          </Tooltip>

          <DrawerContent className="overflow-y-scroll w-fit">
            <DrawerHeader className="flex gap-2 flex-row justify-between">
              <DrawerTitle className="text-2xl font-light ">Filter</DrawerTitle>
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
            <FilterForm open={open} setOpen={setOpen} />
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
