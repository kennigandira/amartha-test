import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  options: SelectOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  errorMessage?: string;
  placeholder?: string;
}

export const Select = ({
  options,
  value,
  onChange,
  errorMessage,
  placeholder = "Select an option",
  className: classNameProp,
  disabled,
  ...props
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption?.label || "";

  const inputClassName = cn(
    classNameProp,
    "border rounded-2xl px-3 py-2 w-full cursor-pointer",
    {
      "bg-gray-200": disabled,
      "border-red-500": errorMessage,
      "border-zinc-500": !errorMessage,
    },
  );

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
      setHighlightedIndex(-1);
    }
  };

  const handleSelectOption = (option: SelectOption) => {
    if (onChange) {
      onChange(option.value);
    }
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(0);
        } else {
          setHighlightedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : prev,
          );
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(options.length - 1);
        } else {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        }
        break;

      case "Enter":
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0 && options[highlightedIndex]) {
          handleSelectOption(options[highlightedIndex]);
        } else if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(-1);
        }
        break;

      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;

      case " ":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(-1);
        }
        break;

      default:
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          {...props}
          ref={inputRef}
          type="text"
          value={displayValue}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
          className={inputClassName}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="select-dropdown"
          aria-haspopup="listbox"
          autoComplete="off"
        />
        <ChevronDown
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 pointer-events-none transition-transform",
            {
              "text-gray-400": disabled,
              "rotate-180": isOpen,
            },
          )}
        />
      </div>

      {errorMessage && (
        <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
      )}

      {isOpen && !disabled && (
        <ul
          ref={dropdownRef}
          id="select-dropdown"
          role="listbox"
          className="absolute z-10 w-full mt-1 bg-white border border-zinc-500 rounded-2xl shadow-lg max-h-60 overflow-auto"
        >
          {options.length === 0 ? (
            <li className="px-3 py-2 text-zinc-600 text-sm">
              No options available
            </li>
          ) : (
            options.map((option, index) => {
              const isHighlighted = index === highlightedIndex;
              const isSelected = option.value === value;

              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectOption(option);
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn("px-3 py-2 cursor-pointer transition-colors", {
                    "bg-green-100": isHighlighted,
                    "bg-green-200 font-semibold": isSelected,
                    "hover:bg-zinc-100": !isHighlighted && !isSelected,
                  })}
                >
                  {option.label}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
};
