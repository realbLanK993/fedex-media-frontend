"use client";

import SecondaryNavbar from "@/components/layout/second-nav";
import { useState } from "react";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selected, setSelected] = useState(0);
  //generate random keywords based on logistics down below in an array
  const logisticsKeywords = [
    "logistics",
    "transportation",
    "shipping",
    "delivery",
    "freight",
    "cargo",
    "packaging",
    "warehousing",
    "air freight",
    "rail",
  ];
  return (
    <div>
      <SecondaryNavbar>
        <div className="flex w-full justify-between">
          {logisticsKeywords.map((keyword, index) => (
            <button
              key={index}
              onClick={() => setSelected(index)}
              className={`${
                selected == index &&
                "bg-primary text-primary-foreground  -skew-x-12"
              } p-1 px-8 text-primary font-semibold cursor-pointer`}
            >
              {keyword.split("")[0].toUpperCase() + keyword.slice(1)}
            </button>
          ))}
        </div>
      </SecondaryNavbar>
      <main>{children}</main>
    </div>
  );
}
