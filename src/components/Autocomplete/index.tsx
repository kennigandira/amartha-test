import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useAutocompleteSearch } from "./use-autocomplete-search";
import { cn } from "@/lib/utils";
import { KEYBOARD_EVENTS } from "@/constants/keyboardEvents";

export interface AutocompleteOption {
  id: number;
  name: string;
}

const MIN_QUERY_LENGTH = 1;
const DEFAULT_DEBOUNCE_MS = 300;
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

const classes = {
  inputContainer: "relative w-full",
  input: (disabled?: boolean, errorMessage?: string, className?: string) =>
    cn(className, "border rounded-2xl px-3 py-2 w-full", {
      "bg-gray-200": disabled,
      "border-red-500": errorMessage,
      "border-zinc-500": !errorMessage,
    }),
  errorValidation: "text-red-600 text-sm mt-1",
  optionsContainer:
    "absolute z-10 w-full mt-1 bg-white border border-zinc-500 rounded-2xl shadow-lg max-h-60 overflow-auto top-10",
  infoItem: "px-3 py-2 text-zinc-600 text-sm",
  errorItem: "px-3 py-2 text-red-600 text-sm",
  optionItem: (isHighlighted: boolean, isSelected: boolean) =>
    cn("px-3 py-2 cursor-pointer transition-colors", {
      "bg-green-100": isHighlighted,
      "bg-green-200 font-semibold": isSelected,
      "hover:bg-zinc-100": !isHighlighted && !isSelected,
    }),
};

const TEXTS = {
  LOADING: "Loading...",
  ERROR: "Error loading results. Please try again.",
  NO_RESULTS: "No results found",
  SEARCH: "Search...",
};

export const Autocomplete = ({
  endpoint,
  onOptionSelect,
  value = "",
  onChange,
  className: classNameProp,
  placeholder = TEXTS.SEARCH,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  minQueryLength = MIN_QUERY_LENGTH,
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
    if (!value) {
      setSelectedOption(null);
    }
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
    if (!isOpen && e.key !== KEYBOARD_EVENTS.ESCAPE) {
      setIsOpen(true);
      return;
    }

    switch (e.key) {
      case KEYBOARD_EVENTS.ARROW_DOWN:
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < data.length - 1 ? prev + 1 : prev,
        );
        break;

      case KEYBOARD_EVENTS.ARROW_UP:
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;

      case KEYBOARD_EVENTS.ENTER:
        e.preventDefault();
        if (highlightedIndex >= 0 && data[highlightedIndex]) {
          handleSelectOption(data[highlightedIndex]);
        }
        break;

      case KEYBOARD_EVENTS.ESCAPE:
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

  const showDropdown = isOpen && !disabled;
  const hasResults = data.length > 0;
  const shouldShowLoading = isLoading && inputValue.length >= minQueryLength;
  const shouldShowEmpty =
    !isLoading && !hasResults && inputValue.length >= minQueryLength && !error;
  const shouldShowError = error && !isLoading;

  return (
    <div ref={containerRef} className={classes.inputContainer}>
      <input
        {...props}
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        placeholder={placeholder}
        className={classes.input(disabled, errorMessage, classNameProp)}
        disabled={disabled}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showDropdown}
        aria-controls="autocomplete-dropdown"
      />

      {errorMessage && (
        <p className={classes.errorValidation}>{errorMessage}</p>
      )}

      {showDropdown && inputValue.length >= minQueryLength && (
        <ul
          ref={dropdownRef}
          id="autocomplete-dropdown"
          role="listbox"
          className={classes.optionsContainer}
        >
          {shouldShowLoading && (
            <li className={classes.infoItem}>{TEXTS.LOADING}</li>
          )}

          {shouldShowError && (
            <li className={classes.errorItem}>{TEXTS.ERROR}</li>
          )}

          {shouldShowEmpty && (
            <li className={classes.infoItem}>{TEXTS.NO_RESULTS}</li>
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
                  className={classes.optionItem(isHighlighted, isSelected)}
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
