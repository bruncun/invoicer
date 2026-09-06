import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { TOOLTIP_SHOW } from "~/constants/constants";
import NavbarActions, { type NavbarActionsProps } from "./actions";

export default function TooltipNavbarActions(props: NavbarActionsProps) {
  return (
    <NavbarActions
      {...props}
      wrap={(action, button) => (
        <OverlayTrigger
          key={action}
          placement="right"
          delay={TOOLTIP_SHOW}
          overlay={
            <Tooltip
              className="d-none d-lg-block"
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
