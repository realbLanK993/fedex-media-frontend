import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface FilterMessageProps {
  filterEnabled: boolean;
}

export function FilterMessage({ filterEnabled }: FilterMessageProps) {
  return (
    <div className="flex items-center justify-center min-h-[200px] p-4">
      <Card className="w-full max-w-md shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {filterEnabled ? "Adjust Your Filter" : "No Articles Available"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
            {filterEnabled
              ? "Your current filter settings are applied. Modify them to see different articles."
              : "No articles match your current criteria. Try adjusting your filters or check back later."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
