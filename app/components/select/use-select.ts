import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

export type SelectOption = {
  value: string;
  label: string;
};

type UseSelectProps = {
  value?: string | number;
  onChange: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
};

export const useSelect = ({
  value,
  onChange,
  options,
  disabled = false,
}: UseSelectProps) => {
  const selectedIndex = Math.max(
    options.findIndex((option) => option.value === value?.toString()),
    0
  );
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(selectedIndex);
  const controlRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const typeahead = useRef("");
  const typeaheadTimeout = useRef<number>();

  useEffect(() => {
    if (!isOpen) return;

    optionRefs.current[highlightedIndex]?.focus();
  }, [highlightedIndex, isOpen]);

  useEffect(
    () => () => window.clearTimeout(typeaheadTimeout.current),
    []
  );

  const close = (restoreFocus = false) => {
    setIsOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  };

  const selectOption = (index: number) => {
    onChange(options[index].value);
    close(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (controlRef.current?.contains(event.target as Node)) return;
      close();
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer, true);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer, true);
    };
  }, [isOpen]);

  const moveHighlight = (offset: number) => {
    setHighlightedIndex((index) =>
      Math.min(Math.max(index + offset, 0), options.length - 1)
    );
  };

  const handleTypeahead = (event: KeyboardEvent) => {
    typeahead.current += event.key.toLowerCase();
    window.clearTimeout(typeaheadTimeout.current);
    typeaheadTimeout.current = window.setTimeout(() => {
      typeahead.current = "";
    }, 500);

    const matchingIndex = options.findIndex((option) =>
      option.label.toLowerCase().startsWith(typeahead.current)
    );

    if (matchingIndex === -1) return;

    event.preventDefault();
    event.stopPropagation();
    setIsOpen(true);
    setHighlightedIndex(matchingIndex);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        event.stopPropagation();
        setIsOpen(true);
        moveHighlight(isOpen ? 1 : 0);
        return;
      case "ArrowUp":
        event.preventDefault();
        event.stopPropagation();
        setIsOpen(true);
        moveHighlight(isOpen ? -1 : 0);
        return;
      case "Home":
        event.preventDefault();
        event.stopPropagation();
        setIsOpen(true);
        setHighlightedIndex(0);
        return;
      case "End":
        event.preventDefault();
        event.stopPropagation();
        setIsOpen(true);
        setHighlightedIndex(options.length - 1);
        return;
      case "Enter":
        event.preventDefault();
        event.stopPropagation();
        if (isOpen) selectOption(highlightedIndex);
        else setIsOpen(true);
        return;
      case " ":
        if (typeahead.current) {
          handleTypeahead(event);
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (isOpen) selectOption(highlightedIndex);
        else setIsOpen(true);
        return;
      case "Escape":
        if (isOpen) {
          event.preventDefault();
          event.stopPropagation();
          close(true);
        }
        return;
      default:
        if (event.key.length !== 1 || event.metaKey || event.ctrlKey) return;
        handleTypeahead(event);
    }
  };

  return {
    controlRef,
    toggleRef,
    optionRefs,
    isOpen,
    highlightedIndex,
    setHighlightedIndex,
    setIsOpen,
    selectOption,
    handleKeyDown,
  };
};
