export const ITEMS_PER_PAGE = 8;

export const PaginationStyle = {
  BUTTON_BASE: "px-3 py-2 rounded border transition-colors cursor-pointer",
  BUTTON_ACTIVE: "bg-green-300 border-green-400 text-black font-semibold",
  BUTTON_INACTIVE: "bg-white border-gray-300 hover:bg-gray-50 text-gray-700",
  BUTTON_DISABLED:
    "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed",
  CONTAINER: "",
  INFO_TEXT: "text-sm text-gray-600 mx-4 mt-4",
} as const;
