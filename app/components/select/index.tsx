import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import Icon from "../icon";

type SelectProps = {
  value?: string | number;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  buttonClassName?: string;
  listboxOptionsStyle?: React.CSSProperties;
};

const Select = ({
  value,
  onChange,
  options,
  buttonClassName = "",
  listboxOptionsStyle = {},
}: SelectProps) => {
  const optionsTable = options.reduce((acc, option) => {
    acc[option.value] = option.label;
    return acc;
  }, {} as { [key: string]: string });

  return (
    <Listbox value={value} onChange={onChange}>
      <ListboxButton
        className={`form-select text-start w-100 ${buttonClassName}`}
      >
        {optionsTable[value as unknown as keyof typeof optionsTable]}
      </ListboxButton>
      <ListboxOptions
        className="dropdown-menu show d-grid gap-1 p-2 rounded-3 text-body-emphasis border outline-0 listbox-options"
        style={{ width: "var(--button-width)", ...listboxOptionsStyle }}
      >
        {options.map((option) => (
          <ListboxOption key={option.value} value={option.value} as={Fragment}>
            {({ focus, selected }) => (
              <div
                className={`dropdown-item rounded-2 px-2 ${
                  selected ? "bg-primary text-white" : ""
                } 
                          ${
                            focus && !selected
                              ? "bg-body-tertiary text-body-emphasis"
                              : ""
                          }`}
              >
                <Icon
                  name="check-lg"
                  className={`text-primary me-2 ${
                    selected ? "text-white" : "opacity-0"
                  }`}
                />
                {option.label}
              </div>
            )}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};

export default Select;
