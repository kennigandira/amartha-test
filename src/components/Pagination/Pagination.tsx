// src/components/Pagination/Pagination.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { calculatePageNumbers, calculateTotalPages } from "@/lib/pagination";
import { PaginationStyle } from "./constants";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  isLoading = false,
}: PaginationProps) => {
  const totalPages = calculateTotalPages(totalItems, itemsPerPage);
  const pageNumbers = calculatePageNumbers(currentPage, totalPages);

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

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="pb-6 text-center">
      <div className="flex items-center gap-2 justify-center mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1 || isLoading}
          className={cn(
            PaginationStyle.BUTTON_BASE,
            currentPage === 1 || isLoading
              ? PaginationStyle.BUTTON_DISABLED
              : PaginationStyle.BUTTON_INACTIVE,
          )}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {pageNumbers[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              disabled={isLoading}
              className={cn(
                PaginationStyle.BUTTON_BASE,
                isLoading
                  ? PaginationStyle.BUTTON_DISABLED
                  : PaginationStyle.BUTTON_INACTIVE,
              )}
            >
              1
            </button>
            {pageNumbers[0] > 2 && (
              <span className="px-2 text-gray-500">...</span>
            )}
          </>
        )}

        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            disabled={isLoading}
            className={cn(
              PaginationStyle.BUTTON_BASE,
              isLoading
                ? PaginationStyle.BUTTON_DISABLED
                : pageNum === currentPage
                  ? PaginationStyle.BUTTON_ACTIVE
                  : PaginationStyle.BUTTON_INACTIVE,
            )}
            aria-label={`Page ${pageNum}`}
            aria-current={pageNum === currentPage ? "page" : undefined}
          >
            {pageNum}
          </button>
        ))}

        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="px-2 text-gray-500">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={isLoading}
              className={cn(
                PaginationStyle.BUTTON_BASE,
                isLoading
                  ? PaginationStyle.BUTTON_DISABLED
                  : PaginationStyle.BUTTON_INACTIVE,
              )}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || isLoading}
          className={cn(
            PaginationStyle.BUTTON_BASE,
            currentPage === totalPages || isLoading
              ? PaginationStyle.BUTTON_DISABLED
              : PaginationStyle.BUTTON_INACTIVE,
          )}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div className={PaginationStyle.INFO_TEXT}>
        Showing {startItem}-{endItem} of {totalItems}
      </div>
    </div>
  );
};
