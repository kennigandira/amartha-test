import { KEYBOARD_EVENTS } from "@/constants/keyboardEvents";
import { useRef, useState } from "react";
import type { KeyboardEvent, Dispatch, SetStateAction } from "react";

interface SelectOption {
  value: string | number;
  label: string;
}

interface UseSelectKeyboardProps {
  options: SelectOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  disabled?: boolean;
  onSelectOption: (option: SelectOption) => void;
}

interface UseSelectKeyboardReturn {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  highlightedIndex: number;
  setHighlightedIndex: Dispatch<SetStateAction<number>>;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export const useSelectKeyboard = ({
  options,
  disabled = false,
  onSelectOption,
}: UseSelectKeyboardProps): UseSelectKeyboardReturn => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleArrowDown = () => {
    if (!isOpen) {
      setIsOpen(true);
      setHighlightedIndex(0);
    } else {
      setHighlightedIndex((prev) =>
        prev < options.length - 1 ? prev + 1 : prev,
      );
    }
  };

  const handleArrowUp = () => {
    if (!isOpen) {
      setIsOpen(true);
      setHighlightedIndex(options.length - 1);
    } else {
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }
  };

  const handleEnter = () => {
    if (isOpen && highlightedIndex >= 0 && options[highlightedIndex]) {
      onSelectOption(options[highlightedIndex]);
    } else if (!isOpen) {
      setIsOpen(true);
      setHighlightedIndex(-1);
    }
  };

  const handleEscape = () => {
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleSpace = () => {
    if (!isOpen) {
      setIsOpen(true);
      setHighlightedIndex(-1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (e.key) {
      case KEYBOARD_EVENTS.ARROW_DOWN:
        e.preventDefault();
        handleArrowDown();
        break;

      case KEYBOARD_EVENTS.ARROW_UP:
        e.preventDefault();
        handleArrowUp();
        break;

      case KEYBOARD_EVENTS.ENTER:
        e.preventDefault();
        handleEnter();
        break;

      case KEYBOARD_EVENTS.ESCAPE:
        e.preventDefault();
        handleEscape();
        break;

      case KEYBOARD_EVENTS.SPACE:
        e.preventDefault();
        handleSpace();
        break;

      default:
        break;
    }
  };

  return {
    isOpen,
    setIsOpen,
    highlightedIndex,
    setHighlightedIndex,
    handleKeyDown,
    inputRef,
  };
};
