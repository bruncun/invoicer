import { Button } from "react-bootstrap";
import Icon from "../icon";
import { MouseEventHandler } from "react";
import { useDayPicker } from "react-day-picker";

const IconLeft = () => <Icon name="chevron-left" aria-hidden="true" />;
const IconRight = () => <Icon name="chevron-right" aria-hidden="true" />;

export type NavigationProps = {
  displayMonth: Date;
  previousMonth?: Date;
  nextMonth?: Date;
  hidePrevious: boolean;
  hideNext: boolean;
  onNextClick: MouseEventHandler<HTMLButtonElement>;
  onPreviousClick: MouseEventHandler<HTMLButtonElement>;
};

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

export default Navigation;
