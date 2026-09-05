import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { TOOLTIP_SHOW } from "~/constants/constants";
import DesktopNavbarActions, {
  type DesktopNavbarActionsProps,
} from "./actions";

export default function DesktopNavbarTooltipActions(
  props: DesktopNavbarActionsProps
) {
  return (
    <DesktopNavbarActions
      {...props}
      wrap={(action, button) => (
        <OverlayTrigger
          key={action}
          placement="right"
          delay={TOOLTIP_SHOW}
          overlay={
            <Tooltip
              id={action === "theme" ? "theme-toggle-tooltip" : "logout-tooltip"}
            >
              {action === "theme" ? "Toggle Theme" : "Logout"}
            </Tooltip>
          }
        >
          {button}
        </OverlayTrigger>
      )}
    />
  );
}
