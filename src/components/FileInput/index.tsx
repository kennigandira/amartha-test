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
    "type" | "onChange" | "onError"
  > {
  onChange?: (file: File | null) => void;
  onError?: (error: string) => void;
  accept?: string;
  maxSize?: number;
  errorMessage?: string;
}

export const FileInput = ({
  className,
  onChange,
  onError,
  accept = ACCEPTED_IMAGE_TYPES.join(","),
  maxSize = MAX_FILE_SIZE_BYTES,
  disabled,
  errorMessage,
  ...props
}: FileInputProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
    onChange?.(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onChange?.(null);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const hasError = !!error || !!errorMessage;

  const containerClassName = cn(
    "border rounded-2xl p-3 w-full cursor-pointer",
    {
      "bg-gray-200": disabled,
      "border-red-500": hasError,
      "border-zinc-500": !hasError,
    },
    className,
  );

  return (
    <div className={containerClassName}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        disabled={disabled}
        className="hidden"
        {...props}
      />

      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={handleBrowseClick}
          disabled={disabled}
          className={cn(
            "px-4 py-2 rounded-lg border border-zinc-500 bg-white hover:bg-zinc-50 transition-colors font-medium",
            { "cursor-pointer opacity-50": disabled },
          )}
        >
          Upload Photo
        </button>

        {selectedFile && (
          <>
            <span className="text-sm text-zinc-700 flex-1 min-w-0 truncate">
              {selectedFile.name}
            </span>
            <button
              type="button"
              onClick={clearFile}
              disabled={disabled}
              className={cn(
                "p-1 rounded-full hover:bg-zinc-200 transition-colors",
                { "cursor-not-allowed opacity-50": disabled },
              )}
              aria-label="Clear file"
            >
              <X size={18} className="text-zinc-700" />
            </button>
          </>
        )}

        {!selectedFile && (
          <span className="text-sm text-zinc-400">No file selected</span>
        )}
      </div>

      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

      {errorMessage && (
        <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
      )}

      {previewUrl && !error && (
        <div className="mt-3">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-full h-auto max-h-48 rounded-lg border border-zinc-300"
          />
        </div>
      )}
    </div>
  );
};
