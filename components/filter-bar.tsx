"use client";

import { useState } from "react";
import { Check, ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Filter categories based on the Excel sheet mentioned
const filterCategories = {
  focus: ["Business", "Product", "Service", "Corporate", "Industry"],
  sentiment: ["Positive", "Neutral", "Negative"],
  page_position: ["Main", "Secondary", "Featured"],
  section_position: ["Top", "Middle", "Bottom"],
  boolean_filters: [
    { id: "products_services", label: "Products & Services" },
    {
      id: "amea_apac_president_positioning",
      label: "AMEA/APAC President Positioning",
    },
    { id: "amea_apac_executive_present", label: "AMEA/APAC Executive Present" },
    { id: "local_leader_present", label: "Local Leader Present" },
    { id: "financial_performance", label: "Financial Performance" },
    { id: "innovation", label: "Innovation" },
    { id: "global_leadership", label: "Global Leadership" },
    { id: "executive_leadership", label: "Executive Leadership" },
    { id: "regulatory", label: "Regulatory" },
    { id: "business_leadership", label: "Business Leadership" },
    { id: "contributes_to_community", label: "Contributes to Community" },
    { id: "environmentally_responsible", label: "Environmentally Responsible" },
    { id: "socially_responsible", label: "Socially Responsible" },
    {
      id: "cares_about_markets_social_needs",
      label: "Cares About Market's Social Needs",
    },
    { id: "sam", label: "SAM" },
    { id: "ecommerce", label: "E-commerce" },
    { id: "asia_eu_intra_amea", label: "Asia-EU/Intra-AMEA" },
  ],
};

export default function FilterBar() {
  // const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [focusFilter, setFocusFilter] = useState<string[]>([]);
  const [sentimentFilter, setSentimentFilter] = useState<string[]>([]);
  const [booleanFilters, setBooleanFilters] = useState<string[]>([]);

  const handleBooleanFilterChange = (id: string) => {
    setBooleanFilters((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const clearAllFilters = () => {
    setFocusFilter([]);
    setSentimentFilter([]);
    setBooleanFilters([]);
  };

  const totalActiveFilters =
    focusFilter.length + sentimentFilter.length + booleanFilters.length;

  return (
    <div className="bg-card border rounded-lg p-4">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="filters">
          <div className="flex items-center justify-between">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {totalActiveFilters > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {totalActiveFilters}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            {totalActiveFilters > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
            )}
          </div>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Focus</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {focusFilter.length > 0
                        ? `${focusFilter.length} selected`
                        : "Select focus"}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Focus</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {filterCategories.focus.map((item) => (
                      <DropdownMenuCheckboxItem
                        key={item}
                        checked={focusFilter.includes(item)}
                        onCheckedChange={() => {
                          setFocusFilter((prev) =>
                            prev.includes(item)
                              ? prev.filter((i) => i !== item)
                              : [...prev, item]
                          );
                        }}
                      >
                        {item}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Sentiment</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {sentimentFilter.length > 0
                        ? `${sentimentFilter.length} selected`
                        : "Select sentiment"}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Sentiment</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {filterCategories.sentiment.map((item) => (
                      <DropdownMenuCheckboxItem
                        key={item}
                        checked={sentimentFilter.includes(item)}
                        onCheckedChange={() => {
                          setSentimentFilter((prev) =>
                            prev.includes(item)
                              ? prev.filter((i) => i !== item)
                              : [...prev, item]
                          );
                        }}
                      >
                        {item}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Date Range</h3>
                <Button variant="outline" className="w-full justify-between">
                  Last 30 days
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Article Attributes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {filterCategories.boolean_filters.map((filter) => (
                  <div key={filter.id} className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`justify-start w-full ${
                        booleanFilters.includes(filter.id)
                          ? "border-primary"
                          : ""
                      }`}
                      onClick={() => handleBooleanFilterChange(filter.id)}
                    >
                      {booleanFilters.includes(filter.id) && (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      <span className="truncate">{filter.label}</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
