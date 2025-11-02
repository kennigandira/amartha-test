import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { useSelectKeyboard } from "./use-select-keyboard";

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

const NO_OPTIONS_TEXT = "No options available";

const classes = {
  container: "relative w-full",
  innerContainer: "relative",
  input: (className?: string, disabled?: boolean, errorMessage?: string) =>
    cn(className, "border rounded-2xl px-3 py-2 w-full cursor-pointer", {
      "bg-gray-200": disabled,
      "border-red-500": errorMessage,
      "border-zinc-500": !errorMessage,
    }),
  chevronIcon: (isOpen: boolean, disabled?: boolean) =>
    cn(
      "absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 pointer-events-none transition-transform",
      {
        "text-gray-400": disabled,
        "rotate-180": isOpen,
      },
    ),
  errorMessage: "text-red-600 text-sm mt-1",
  optionsContainer:
    "absolute z-10 w-full mt-1 bg-white border border-zinc-500 rounded-2xl shadow-lg max-h-60 overflow-auto",
  infoItem: "px-3 py-2 text-zinc-600 text-sm",
  optionItem: (isHighlighted: boolean, isSelected: boolean) =>
    cn("px-3 py-2 cursor-pointer transition-colors", {
      "bg-green-100": isHighlighted,
      "bg-green-200 font-semibold": isSelected,
      "hover:bg-zinc-100": !isHighlighted && !isSelected,
    }),
};

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
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const handleSelectOption = (option: SelectOption) => {
    if (onChange) {
      onChange(option.value);
    }
  };

  const handleMouseDown = (
    e: React.MouseEvent<HTMLLIElement>,
    option: SelectOption,
  ) => {
    e.preventDefault();
    handleSelectOption(option);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const {
    isOpen,
    setIsOpen,
    highlightedIndex,
    setHighlightedIndex,
    handleKeyDown,
    inputRef,
  } = useSelectKeyboard({
    options,
    disabled,
    onSelectOption: (option) => {
      handleSelectOption(option);
      setIsOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.focus();
    },
  });

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
  }, [setIsOpen, setHighlightedIndex]);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption?.label || "";

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className={classes.container}>
      <div className={classes.innerContainer}>
        <input
          {...props}
          ref={inputRef}
          type="text"
          value={displayValue}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
          className={classes.input(classNameProp, disabled, errorMessage)}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="select-dropdown"
          aria-haspopup="listbox"
          autoComplete="off"
        />
        <ChevronDown className={classes.chevronIcon(isOpen, disabled)} />
      </div>

      {errorMessage && <p className={classes.errorMessage}>{errorMessage}</p>}

      {isOpen && !disabled && (
        <ul
          ref={dropdownRef}
          id="select-dropdown"
          role="listbox"
          className={classes.optionsContainer}
        >
          {options.length === 0 ? (
            <li className={classes.infoItem}>{NO_OPTIONS_TEXT}</li>
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
                    handleMouseDown(e, option);
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={classes.optionItem(isHighlighted, isSelected)}
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
