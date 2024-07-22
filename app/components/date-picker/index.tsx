import { Dropdown, Form } from "react-bootstrap";
import Icon from "../icon";
import { useId, useState } from "react";
import { format, parseISO } from "date-fns";
import { DayPicker } from "react-day-picker";
import Caption from "./caption";

export const IconLeft = () => <Icon name="chevron-left" aria-hidden="true" />;
export const IconRight = () => <Icon name="chevron-right" aria-hidden="true" />;

type DatePickerProps = {
  label: string;
  selected?: string;
  onChange: (event: Event) => void;
  disabled?: boolean;
} & React.HTMLAttributes<HTMLInputElement>;

function DatePicker({ selected, label, onChange, disabled }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [month, setMonth] = useState(new Date());
  const inputId = useId();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    selected ? parseISO(selected) : undefined
  );

  const handleDayPickerSelect = (date?: Date) => {
    if (!date) {
      setSelectedDate(undefined);
    } else {
      setSelectedDate(date);
      const event = new Event("change", { bubbles: true });
      const formattedDate = format(date, "yyyy-MM-dd");
      Object.defineProperty(event, "target", {
        value: { value: formattedDate },
        writable: true,
      });
      onChange(event);
      setIsOpen(false);
    }
  };

  const onDropdownToggle = (isOpen: boolean) => setIsOpen(isOpen);

  return (
    <Dropdown onToggle={onDropdownToggle} show={isOpen} className="date-picker">
      <Form.Label className="form-label" htmlFor={inputId}>
        {label}
      </Form.Label>
      <Dropdown.Toggle
        className="rounded-2 w-100 d-flex border"
        variant="link"
        disabled={disabled}
      >
        <Icon name="calendar" className="me-2 text-body-emphasis" />
        {selected && (
          <span className="text-body-emphasis">
            {format(parseISO(selected), "MMM dd yyyy")}
          </span>
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu className="p-2 border" flip={false}>
        <div className="d-grid gap-1">
          <DayPicker
            hideHead
            formatters={{
              formatCaption: (month: Date) => format(month, "MMM yyyy"),
            }}
            month={month}
            onMonthChange={setMonth}
            initialFocus
            components={{
              Caption,
              IconLeft,
              IconRight,
            }}
            classNames={{
              button: "btn btn-link fw-normal rounded-2 date-picker-button",
              button_reset: "w-100",
              caption: "d-flex justify-content-between align-items-center",
              caption_label: "fw-medium text-body-emphasis",
              cell: "text-center",
              day: "px-1 py-0 date-picker-day",
              day_selected: "bg-primary text-white",
              nav_button: "p-1 rounded-2 ",
              head_cell: "text-center",
            }}
            mode="single"
            selected={selectedDate}
            onSelect={handleDayPickerSelect}
          />
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DatePicker;
