import { Button } from "react-bootstrap";
import { MouseEventHandler } from "react";
import { isSameMonth } from "date-fns";
import {
  CaptionLabel,
  IconLeft,
  useDayPicker,
  useNavigation,
} from "react-day-picker";
import { IconRight } from ".";

export type CaptionProps = {
  id?: string;
  displayMonth: Date;
  displayIndex?: number | undefined;
};

const Caption = (props: CaptionProps) => {
  const {
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

  const handlePreviousClick: MouseEventHandler = () => {
    if (!previousMonth) return;
    goToMonth(previousMonth);
  };

  const handleNextClick: MouseEventHandler = () => {
    if (!nextMonth) return;
    goToMonth(nextMonth);
  };

  if (!nextMonth && !previousMonth) return <></>;

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

  return (
    <div className={classNames.caption} style={styles.caption}>
      <Button
        variant="link"
        name="previous-month"
        aria-label={previousLabel}
        className={previousClassName}
        style={styles.nav_button_previous}
        disabled={!previousMonth}
        onClick={handlePreviousClick}
      >
        <IconLeftComponent
          className={classNames.nav_icon}
          style={styles.nav_icon}
        />
      </Button>
      <CaptionLabelComponent
        id={props.id}
        displayMonth={props.displayMonth}
        displayIndex={displayIndex}
      />
      <Button
        variant="link"
        name="next-month"
        aria-label={nextLabel}
        className={nextClassName}
        style={styles.nav_button_next}
        disabled={!nextMonth}
        onClick={handleNextClick}
      >
        <IconRightComponent
          className={classNames.nav_icon}
          style={styles.nav_icon}
        />
      </Button>
    </div>
  );
};

export default Caption;
