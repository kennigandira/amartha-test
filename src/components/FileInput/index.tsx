import { useRef, useState } from "react";
import { X } from "lucide-react";
import {
  ACCEPTED_IMAGE_TYPES,
  FILE_INPUT_ERROR_MESSAGES,
  MAX_FILE_SIZE_BYTES,
} from "@/constants/fileInput";
import { cn } from "@/lib/utils";

export interface FileInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange" | "onError" | "value"
  > {
  onChange?: (file: string | null) => void;
  onError?: (error: string) => void;
  accept?: string;
  maxSize?: number;
  errorMessage?: string;
  value?: string;
}

const classes = {
  container: (disabled?: boolean, hasError?: boolean, className?: string) =>
    cn(className, "border rounded-2xl p-3 w-full cursor-pointer", {
      "bg-gray-200": disabled,
      "border-red-500": hasError,
      "border-zinc-500": !hasError,
    }),
  fileInputContainer: "flex items-center gap-2 flex-wrap",
  input: "hidden",
  button:
    "cursor-pointer px-4 py-2 rounded-lg border border-zinc-500 bg-white hover:bg-zinc-50 transition-colors font-medium",
  selectedFile: "text-sm text-zinc-700 flex-1 min-w-0 truncate",
  clearButton: (disabled?: boolean) =>
    cn("p-1 rounded-full hover:bg-zinc-200 transition-colors", {
      "cursor-not-allowed opacity-50": disabled,
    }),
  clearButtonIcon: "text-zinc-700",
  noFileSelected: "text-sm text-zinc-400",
  errorUploadMessage: "mt-2 text-sm text-red-600",
  validationErrorMessage: "text-red-600 text-sm mt-1",
  previewImageContainer: "mt-3",
  previewImage:
    "max-w-full h-auto max-h-48 rounded-lg border border-zinc-300 mx-auto",
};

const PLACEHOLDER_TEXT = {
  noFileSelected: "No file selected",
  uploadPhoto: "Upload Photo",
};

export const FileInput = ({
  className,
  onChange,
  onError,
  accept = ACCEPTED_IMAGE_TYPES.join(","),
  maxSize = MAX_FILE_SIZE_BYTES,
  disabled,
  errorMessage: validationErrorMessage,
  value,
  ...props
}: FileInputProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (!file) {
      clearFile();
      return;
    }

    if (file.size > maxSize) {
      const errorMessage = FILE_INPUT_ERROR_MESSAGES.fileTooLarge;
      setError(errorMessage);
      onError?.(errorMessage);
      clearFile();
      return;
    }

    setError(null);

    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          onChange?.(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onChange?.(null);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const hasError = !!error || !!validationErrorMessage;

  return (
    <div className={classes.container(disabled, hasError, className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        disabled={disabled}
        className={classes.input}
        {...props}
      />

      <div className={classes.fileInputContainer}>
        <button
          type="button"
          onClick={handleBrowseClick}
          disabled={disabled}
          className={classes.button}
        >
          {PLACEHOLDER_TEXT.uploadPhoto}
        </button>

        {selectedFile && (
          <>
            <span className={classes.selectedFile}>{selectedFile.name}</span>
            <button
              type="button"
              onClick={clearFile}
              disabled={disabled}
              className={classes.clearButton(disabled)}
              aria-label="Clear file"
            >
              <X size={18} className={classes.clearButtonIcon} />
            </button>
          </>
        )}

        {!selectedFile && (
          <span className={classes.noFileSelected}>
            {PLACEHOLDER_TEXT.noFileSelected}
          </span>
        )}
      </div>

      {error && <div className={classes.errorUploadMessage}>{error}</div>}

      {validationErrorMessage && (
        <p className={classes.validationErrorMessage}>
          {validationErrorMessage}
        </p>
      )}

      {value && !error && (
        <div className={classes.previewImageContainer}>
          <img src={value} alt="Preview" className={classes.previewImage} />
        </div>
      )}
    </div>
  );
};
