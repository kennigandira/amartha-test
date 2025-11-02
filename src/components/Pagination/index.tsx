import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { calculatePageNumbers, calculateTotalPages } from "@/lib/pagination";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const classes = {
  container: "pb-6 text-center",
  innerContainer: "flex items-center gap-2 justify-center mt-6",
  button: (currentPage: number, isLoading: boolean) =>
    cn(
      "px-3 py-2 rounded border transition-colors cursor-pointer",
      currentPage === 1 || isLoading
        ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-white border-gray-300 hover:bg-gray-50 text-gray-700",
    ),
  ellipsis: "px-2 text-gray-500",
  infoText: "text-sm text-gray-600 mx-4 mt-4",
};

const ELLIPSIS_TEXT = "...";
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
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1 || isLoading}
          className={classes.button(currentPage, isLoading)}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {pageNumbers[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              disabled={isLoading}
              className={classes.button(1, isLoading)}
            >
              1
            </button>
            {pageNumbers[0] > 2 && (
              <span className={classes.ellipsis}>{ELLIPSIS_TEXT}</span>
            )}
          </>
        )}

        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            disabled={isLoading}
            className={classes.button(pageNum, isLoading)}
            aria-label={`Page ${pageNum}`}
            aria-current={pageNum === currentPage ? "page" : undefined}
          >
            {pageNum}
          </button>
        ))}

        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className={classes.ellipsis}>{ELLIPSIS_TEXT}</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={isLoading}
              className={classes.button(totalPages, isLoading)}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || isLoading}
          className={classes.button(currentPage, isLoading)}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div className={classes.infoText}>
        Showing {startItem}-{endItem} of {totalItems}
      </div>
    </div>
  );
};
