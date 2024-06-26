import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import Icon from "../icon";
import { useState } from "react";

const options = [
  { id: 1, name: "Durward Reynolds" },
  { id: 2, name: "Kenton Towne" },
  { id: 3, name: "Therese Wunsch" },
  { id: 4, name: "Benedict Kessler" },
  { id: 5, name: "Katelyn Rohan" },
];

const Select = () => {
  const [selected, setSelected] = useState(options[0]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      <ListboxButton className="form-select text-start w-100">
        {selected.name}
      </ListboxButton>
      <ListboxOptions
        anchor="bottom"
        className="dropdown-menu show d-grid gap-1 p-2 rounded-3 border text-body-emphasis"
        style={{ width: "var(--button-width)" }}
      >
        {options.map((person) => (
          <ListboxOption key={person.id} value={person} as={Fragment}>
            {({ focus, selected }) => (
              <div className="dropdown-item rounded-2 px-2 text-body-emphasis">
                <Icon
                  name="check2"
                  className={`text-primary me-2 ${
                    !selected ? "opacity-0" : ""
                  }`}
                />
                {person.name}
              </div>
            )}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};

export default Select;
