// components/PaginationControls.tsx
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"; // Assuming you have lucide-react

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page or no items
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Calculate item range for display
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between mt-6 mb-2">
      <div>
        {totalItems > 0 && (
          <p className="text-sm text-muted-foreground">
            Showing {startItem} - {endItem} of {totalItems} results
          </p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
