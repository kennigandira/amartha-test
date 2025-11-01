import clsx from "clsx";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useAutocompleteSearch } from "./use-autocomplete-search";

interface AutocompleteOption {
  id: number;
  name: string;
}

interface AutocompleteProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  endpoint: string;
  onOptionSelect?: (option: AutocompleteOption | null) => void;
  value?: string;
  onChange?: (value: string) => void;
  debounceMs?: number;
  minQueryLength?: number;
  errorMessage?: string;
}

export const Autocomplete = ({
  endpoint,
  onOptionSelect,
  value = "",
  onChange,
  className: classNameProp,
  placeholder = "Search...",
  debounceMs = 300,
  minQueryLength = 1,
  disabled,
  errorMessage,
  ...props
}: AutocompleteProps) => {
  const [inputValue, setInputValue] = useState<string>(value);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [selectedOption, setSelectedOption] =
    useState<AutocompleteOption | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const { data, isLoading, error } = useAutocompleteSearch({
    searchQuery: inputValue,
    endpoint,
    debounceMs,
    minQueryLength,
  });

  useEffect(() => {
    setInputValue(value);
  }, [value]);

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

  useEffect(() => {
    if (highlightedIndex >= 0 && dropdownRef.current) {
      const highlightedElement = dropdownRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
    setSelectedOption(null);

    if (newValue === "" && onOptionSelect) {
      onOptionSelect(null);
    }

    if (onChange) {
      onChange(newValue);
    }
  };

  const handleSelectOption = (option: AutocompleteOption) => {
    setInputValue(option.name);
    setSelectedOption(option);
    setIsOpen(false);
    setHighlightedIndex(-1);

    if (onOptionSelect) {
      onOptionSelect(option);
    }

    if (onChange) {
      onChange(option.name);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && e.key !== "Escape") {
      setIsOpen(true);
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < data.length - 1 ? prev + 1 : prev,
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;

      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && data[highlightedIndex]) {
          handleSelectOption(data[highlightedIndex]);
        }
        break;

      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;

      default:
        break;
    }
  };

  const handleFocus = () => {
    if (inputValue.length >= minQueryLength) {
      setIsOpen(true);
    }
  };

  const inputClassName = clsx(
    classNameProp,
    "border rounded-2xl px-3 py-2 w-full",
    {
      "bg-gray-200": disabled,
      "border-red-500": errorMessage,
      "border-zinc-500": !errorMessage,
    },
  );

  const showDropdown = isOpen && !disabled;
  const hasResults = data.length > 0;
  const shouldShowLoading = isLoading && inputValue.length >= minQueryLength;
  const shouldShowEmpty =
    !isLoading && !hasResults && inputValue.length >= minQueryLength && !error;
  const shouldShowError = error && !isLoading;

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        {...props}
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        placeholder={placeholder}
        className={inputClassName}
        disabled={disabled}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showDropdown}
        aria-controls="autocomplete-dropdown"
      />

      {errorMessage && (
        <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
      )}

      {showDropdown && (
        <ul
          ref={dropdownRef}
          id="autocomplete-dropdown"
          role="listbox"
          className="absolute z-10 w-full mt-1 bg-white border border-zinc-500 rounded-2xl shadow-lg max-h-60 overflow-auto"
        >
          {shouldShowLoading && (
            <li className="px-3 py-2 text-zinc-600 text-sm">Loading...</li>
          )}

          {shouldShowError && (
            <li className="px-3 py-2 text-red-600 text-sm">
              Error loading results. Please try again.
            </li>
          )}

          {shouldShowEmpty && (
            <li className="px-3 py-2 text-zinc-600 text-sm">
              No results found
            </li>
          )}

          {!isLoading &&
            !error &&
            hasResults &&
            data.map((option, index) => {
              const isHighlighted = index === highlightedIndex;
              const isSelected = selectedOption?.id === option.id;

              return (
                <li
                  key={option.id}
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectOption(option);
                  }}
                  className={clsx(
                    "px-3 py-2 cursor-pointer transition-colors",
                    {
                      "bg-green-100": isHighlighted,
                      "bg-green-200 font-semibold": isSelected,
                      "hover:bg-zinc-100": !isHighlighted && !isSelected,
                    },
                  )}
                >
                  {option.name}
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
};
