import { Dropdown } from "react-bootstrap";
import Icon from "~/components/icon";
import { STATUSES } from "~/constants/constants";
import type { Enums } from "~/types/supabase";
import useFilterPagination from "~/hooks/invoices/use-filter-pagination";

type FilterDropdownProps = {
  show: boolean;
  onShowChange: (show: boolean) => void;
  onIntent: () => void;
};

export default function FilterDropdown({
  show,
  onShowChange,
  onIntent,
}: FilterDropdownProps) {
  const { filters, setFilters } = useFilterPagination();
  const handleStatusChange = (status: Enums<"status">, checked: boolean) =>
    checked
      ? setFilters([...filters, status])
      : setFilters(filters.filter((filter) => filter !== status));

  return (
    <Dropdown
      focusFirstItemOnShow
      show={show}
      onToggle={(nextShow) => onShowChange(nextShow)}
    >
      <Dropdown.Toggle
        variant="link"
        className="user-select-none"
        onPointerEnter={onIntent}
        onFocus={onIntent}
      >
        Filter
        <span className="d-none d-sm-inline-block">&nbsp;by Status</span>
        <Icon name="chevron-down ms-2" aria-hidden="true" />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <div className="px-3 py-2">
          {STATUSES.map((status) => (
            <div key={status} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={status}
                value={status}
                checked={filters.includes(status)}
                onChange={({ target: { checked } }) =>
                  handleStatusChange(status, checked)
                }
              />
              <label className="form-check-label" htmlFor={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </label>
            </div>
          ))}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}
