"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getTopTags, TopTagItem } from "@/app/api-service";
import { useParams } from "next/navigation";

export default function CategoryNav() {
  const [categories, setCategories] = useState<TopTagItem[]>([]);
  const params = useParams();
  
  const activeTopic = params?.topic ? decodeURIComponent(params.topic as string) : "";

  useEffect(() => {
    getTopTags(11).then(tags => {
      if (tags) {
        setCategories(tags);
      }
    });
  }, []);

  return (
    <div className="w-full border-b bg-background">
      <div className="flex gap-6 p-4 overflow-x-auto whitespace-nowrap hide-scrollbar">
        {categories.map((cat) => {
          const isActive = activeTopic === cat.tag;
          return (
            <Link
              href={`/dashboard/topics/${encodeURIComponent(cat.tag)}`}
              key={cat.tag}
              className={`text-sm font-semibold px-6 py-2 transition-colors inline-block ${isActive
                ? "bg-[#5D1E89] text-white skew-x-[-10deg]"
                : "text-primary hover:text-[#5D1E89]"
                }`}
            >
              <div className={isActive ? "skew-x-[10deg]" : ""}>{cat.tag}</div>
            </Link>
          );
        })}
        {categories.length === 0 && (
          <div className="text-sm font-semibold px-6 py-2 text-primary opacity-50">Loading topics...</div>
        )}
      </div>
    </div>
  );
}
