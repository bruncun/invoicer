import { Dropdown } from "react-bootstrap";
import type { CSSProperties } from "react";
import Icon from "../icon";
import { type SelectOption, useSelect } from "./use-select";

type SelectProps = {
  value?: string | number;
  onChange: (value: string) => void;
  options: SelectOption[];
  buttonClassName?: string;
  menuClassName?: string;
  listboxOptionsStyle?: CSSProperties;
  disabled?: boolean;
  drop?: "up" | "down";
  ariaLabel?: string;
};

const Select = ({
  value,
  onChange,
  options,
  buttonClassName = "",
  menuClassName = "",
  listboxOptionsStyle = {},
  disabled = false,
  drop = "down",
  ariaLabel,
}: SelectProps) => {
  const selectedOption = options.find(
    (option) => option.value === value?.toString()
  );
  const {
    controlRef,
    toggleRef,
    optionRefs,
    isOpen,
    highlightedIndex,
    setHighlightedIndex,
    setIsOpen,
    selectOption,
    handleKeyDown,
  } = useSelect({ value, onChange, options, disabled });

  return (
    <div ref={controlRef}>
      <Dropdown
        drop={drop}
        show={isOpen}
        autoClose
        onToggle={(nextShow) => {
          setIsOpen(nextShow);
          if (nextShow) {
            setHighlightedIndex(
              Math.max(
                options.findIndex(
                  (option) => option.value === value?.toString()
                ),
                0
              )
            );
          }
        }}
      >
        <Dropdown.Toggle
          ref={toggleRef}
          variant="link"
          disabled={disabled}
          aria-label={ariaLabel}
          className={`form-select select-toggle text-start w-100 ${buttonClassName}`}
          onKeyDownCapture={handleKeyDown}
        >
          {selectedOption?.label}
        </Dropdown.Toggle>
        {isOpen && (
          <Dropdown.Menu
            role="listbox"
            className={`d-grid gap-1 p-2 rounded-3 text-body-emphasis border outline-0 listbox-options ${menuClassName}`}
            style={{ minWidth: "100%", ...listboxOptionsStyle }}
            onKeyDownCapture={handleKeyDown}
          >
            {options.map((option, optionIndex) => {
              const isSelected = option.value === value?.toString();

              return (
                <Dropdown.Item
                  key={option.value}
                  eventKey={option.value}
                  ref={(element: HTMLAnchorElement | null) => {
                    optionRefs.current[optionIndex] = element;
                  }}
                  role="option"
                  aria-selected={isSelected}
                  active={isSelected}
                  className={`rounded-2 px-2 ${
                    highlightedIndex === optionIndex && !isSelected
                      ? "bg-body-tertiary text-body-emphasis"
                      : ""
                  }`}
                  onFocus={() => setHighlightedIndex(optionIndex)}
                  onMouseEnter={() => setHighlightedIndex(optionIndex)}
                  onClick={() => selectOption(optionIndex)}
                >
                  <Icon
                    name="check-lg"
                    className={`text-primary me-2 ${
                      isSelected ? "text-white" : "opacity-0"
                    }`}
                    aria-hidden="true"
                  />
                  {option.label}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        )}
      </Dropdown>
    </div>
  );
};

export default Select;
