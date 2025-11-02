export function calculatePageNumbers(
  currentPage: number,
  totalPages: number,
): number[] {
  const maxVisible = 5;

  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function calculateTotalPages(
  totalItems: number,
  itemsPerPage: number,
): number {
  return Math.max(1, Math.ceil(totalItems / itemsPerPage));
}
