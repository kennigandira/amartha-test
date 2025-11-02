export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const FILE_INPUT_ERROR_MESSAGES = {
  fileTooLarge: `File size must be less than ${MAX_FILE_SIZE_MB}MB`,
  invalidType: "Please select a valid image file (JPG, PNG, WebP, or GIF)",
  uploadFailed: "Failed to upload file. Please try again.",
  noFileSelected: "No file selected",
} as const;
