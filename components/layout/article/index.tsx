"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import { Filter, HardDriveDownload, X } from "lucide-react";
import FilterForm from "@/components/articles/form";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import { useFilterStore } from "@/store/filterStore";

export default function ArticleNavbar() {
  const articleCount = useFilterStore((state) => state.data.length);
  const [open, setOpen] = useState(false);
  const clearFilter = useFilterStore((state) => state.clearFilters);
  const filterEnabled = useFilterStore((state) => state.filterEnabled);
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
              <Button>Download</Button>
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
