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
      <main>{children}</main>
    </div>
  );
}
