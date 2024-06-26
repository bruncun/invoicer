import { Button, Dropdown, Form } from "react-bootstrap";
import Icon from "../icon";
import { MouseEventHandler, useId, useState } from "react";
import { format, isSameMonth, parseISO } from "date-fns";
import {
  CaptionDropdowns,
  CaptionLabel,
  DayPicker,
  useDayPicker,
  useNavigation,
} from "react-day-picker";
import { formatDisplayDate } from "~/utility/formatters";

const IconLeft = () => <Icon name="chevron-left" className="text-primary" />;
const IconRight = () => <Icon name="chevron-right" className="text-primary" />;

type DatePickerProps = {
  label: string;
  selected: string;
  onChange: (event: Event) => void;
} & React.HTMLAttributes<HTMLInputElement>;

function DatePicker({ selected, label, onChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [month, setMonth] = useState(new Date());
  const inputId = useId();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    parseISO(selected)
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
      console.log("isOpen", isOpen);
    }
  };

  const onDropdownToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  return (
    <Dropdown onToggle={onDropdownToggle} show={isOpen} className="date-picker">
      <Form.Label className="form-label" htmlFor={inputId}>
        {label}
      </Form.Label>
      <Dropdown.Toggle className="rounded-2 w-100 d-flex border" variant="link">
        <Icon name="calendar" className="me-2" />
        {selectedDate !== undefined && (
          <span className="text-body-emphasis">
            {formatDisplayDate(selectedDate.toISOString())}
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
              button: "btn btn-link fw-normal rounded-2 hover-bg-body-tertiary",
              button_reset: "w-100",
              caption: "d-flex justify-content-between align-items-center",
              caption_label: "fw-medium text-body-emphasis",
              cell: "text-center",
              day: "px-1 py-0 day",
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

/** Represent the props of the {@link Caption} component. */
export interface CaptionProps {
  /**
   * The ID for the heading element. Must be the same as the labelled-by in
   * Table.
   */
  id?: string;
  /** The month where the caption is displayed. */
  displayMonth: Date;
  /**
   * The index of the month where the caption is displayed. Older custom
   * components may miss this prop.
   */
  displayIndex?: number | undefined;
}

/**
 * The layout of the caption:
 *
 * - `dropdown`: display dropdowns for choosing the month and the year.
 * - `buttons`: display previous month / next month buttons.
 * - `dropdown-buttons`: display both month / year dropdowns and previous month /
 *   next month buttons.
 */
export type CaptionLayout = "dropdown" | "buttons" | "dropdown-buttons";

/**
 * Render the caption of a month. The caption has a different layout when
 * setting the {@link DayPickerBase.captionLayout} prop.
 */
export function Caption(props: CaptionProps): JSX.Element {
  const {
    dir,
    disableNavigation,
    captionLayout,
    locale,
    classNames,
    styles,
    numberOfMonths,
    labels: { labelPrevious, labelNext },
    components,
  } = useDayPicker();
  const { previousMonth, nextMonth, goToMonth, displayMonths } =
    useNavigation();

  const displayIndex = displayMonths.findIndex((month) =>
    isSameMonth(props.displayMonth, month)
  );

  const isFirst = displayIndex === 0;
  const isLast = displayIndex === displayMonths.length - 1;

  const hideNext = numberOfMonths > 1 && (isFirst || !isLast);
  const hidePrevious = numberOfMonths > 1 && (isLast || !isFirst);

  const handlePreviousClick: MouseEventHandler = () => {
    if (!previousMonth) return;
    goToMonth(previousMonth);
  };

  const handleNextClick: MouseEventHandler = () => {
    if (!nextMonth) return;
    goToMonth(nextMonth);
  };

  if (!nextMonth && !previousMonth) {
    return <></>;
  }

  const previousLabel = labelPrevious(previousMonth, { locale });
  const previousClassName = [
    classNames.nav_button,
    classNames.nav_button_previous,
  ].join(" ");

  const nextLabel = labelNext(nextMonth, { locale });
  const nextClassName = [
    classNames.nav_button,
    classNames.nav_button_next,
  ].join(" ");

  const IconRightComponent = components?.IconRight ?? IconRight;
  const IconLeftComponent = components?.IconLeft ?? IconLeft;
  const CaptionLabelComponent = components?.CaptionLabel ?? CaptionLabel;

  let caption: JSX.Element;
  if (disableNavigation) {
    caption = (
      <CaptionLabelComponent id={props.id} displayMonth={props.displayMonth} />
    );
  } else if (captionLayout === "dropdown") {
    caption = (
      <CaptionDropdowns displayMonth={props.displayMonth} id={props.id} />
    );
  } else if (captionLayout === "dropdown-buttons") {
    caption = (
      <>
        <CaptionDropdowns
          displayMonth={props.displayMonth}
          displayIndex={props.displayIndex}
          id={props.id}
        />
        <CaptionNavigation
          displayMonth={props.displayMonth}
          displayIndex={props.displayIndex}
          id={props.id}
        />
      </>
    );
  } else {
    caption = (
      <>
        {!hidePrevious && (
          <Button
            variant="link"
            name="previous-month"
            aria-label={previousLabel}
            className={previousClassName}
            style={styles.nav_button_previous}
            disabled={!previousMonth}
            onClick={handlePreviousClick}
          >
            {dir === "rtl" ? (
              <IconRightComponent
                className={classNames.nav_icon}
                style={styles.nav_icon}
              />
            ) : (
              <IconLeftComponent
                className={classNames.nav_icon}
                style={styles.nav_icon}
              />
            )}
          </Button>
        )}
        <CaptionLabelComponent
          id={props.id}
          displayMonth={props.displayMonth}
          displayIndex={displayIndex}
        />
        {!hideNext && (
          <Button
            variant="link"
            name="next-month"
            aria-label={nextLabel}
            className={nextClassName}
            style={styles.nav_button_next}
            disabled={!nextMonth}
            onClick={handleNextClick}
          >
            {dir === "rtl" ? (
              <IconLeftComponent
                className={classNames.nav_icon}
                style={styles.nav_icon}
              />
            ) : (
              <IconRightComponent
                className={classNames.nav_icon}
                style={styles.nav_icon}
              />
            )}
          </Button>
        )}
      </>
    );
  }

  return (
    <div className={classNames.caption} style={styles.caption}>
      {caption}
    </div>
  );
}

/** Render a caption with a button-based navigation. */
export function CaptionNavigation(props: CaptionProps): JSX.Element {
  const { numberOfMonths } = useDayPicker();
  const { previousMonth, nextMonth, goToMonth, displayMonths } =
    useNavigation();

  const displayIndex = displayMonths.findIndex((month) =>
    isSameMonth(props.displayMonth, month)
  );

  const isFirst = displayIndex === 0;
  const isLast = displayIndex === displayMonths.length - 1;

  const hideNext = numberOfMonths > 1 && (isFirst || !isLast);
  const hidePrevious = numberOfMonths > 1 && (isLast || !isFirst);

  const handlePreviousClick: MouseEventHandler = () => {
    if (!previousMonth) return;
    goToMonth(previousMonth);
  };

  const handleNextClick: MouseEventHandler = () => {
    if (!nextMonth) return;
    goToMonth(nextMonth);
  };

  return (
    <Navigation
      displayMonth={props.displayMonth}
      hideNext={hideNext}
      hidePrevious={hidePrevious}
      nextMonth={nextMonth}
      previousMonth={previousMonth}
      onPreviousClick={handlePreviousClick}
      onNextClick={handleNextClick}
    />
  );
}

/** The props for the {@link Navigation} component. */
export interface NavigationProps {
  /** The month where the caption is displayed. */
  displayMonth: Date;
  /** The previous month. */
  previousMonth?: Date;
  /** The next month. */
  nextMonth?: Date;
  /** Hide the previous button. */
  hidePrevious: boolean;
  /** Hide the next button. */
  hideNext: boolean;
  /** Event handler when the next button is clicked. */
  onNextClick: MouseEventHandler<HTMLButtonElement>;
  /** Event handler when the previous button is clicked. */
  onPreviousClick: MouseEventHandler<HTMLButtonElement>;
}

/** A component rendering the navigation buttons or the drop-downs. */
export function Navigation(props: NavigationProps): JSX.Element {
  const {
    dir,
    locale,
    classNames,
    styles,
    labels: { labelPrevious, labelNext },
    components,
  } = useDayPicker();

  if (!props.nextMonth && !props.previousMonth) {
    return <></>;
  }

  const previousLabel = labelPrevious(props.previousMonth, { locale });
  const previousClassName = [
    classNames.nav_button,
    classNames.nav_button_previous,
  ].join(" ");

  const nextLabel = labelNext(props.nextMonth, { locale });
  const nextClassName = [
    classNames.nav_button,
    classNames.nav_button_next,
  ].join(" ");

  const IconRightComponent = components?.IconRight ?? IconRight;
  const IconLeftComponent = components?.IconLeft ?? IconLeft;
  return (
    <>
      {!props.hidePrevious && (
        <Button
          variant="link"
          name="previous-month"
          aria-label={previousLabel}
          style={styles.nav_button_previous}
          disabled={!props.previousMonth}
          onClick={props.onPreviousClick}
        >
          {dir === "rtl" ? (
            <IconRightComponent
              className={classNames.nav_icon}
              style={styles.nav_icon}
            />
          ) : (
            <IconLeftComponent
              className={classNames.nav_icon}
              style={styles.nav_icon}
            />
          )}
        </Button>
      )}
      {!props.hideNext && (
        <Button
          variant="link"
          name="next-month"
          aria-label={nextLabel}
          className={nextClassName}
          style={styles.nav_button_next}
          disabled={!props.nextMonth}
          onClick={props.onNextClick}
        >
          {dir === "rtl" ? (
            <IconLeftComponent
              className={classNames.nav_icon}
              style={styles.nav_icon}
            />
          ) : (
            <IconRightComponent
              className={classNames.nav_icon}
              style={styles.nav_icon}
            />
          )}
        </Button>
      )}
    </>
  );
}

export default DatePicker;
