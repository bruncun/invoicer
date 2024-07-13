import {
  Button,
  OverlayTrigger,
  Spinner,
  Stack,
  Tooltip,
} from "react-bootstrap";
import Icon from "../icon";
import { Link } from "@remix-run/react";
import logoSvg from "~/assets/logo.svg";
import { TOOLTIP_SHOW } from "~/constants";

type DesktopNavbarProps = {
  theme: string;
  toggleTheme: () => void;
  logout: () => void;
  isLoading: boolean;
  invoicesListUrl: string;
};

const DesktopNavbar = ({
  theme,
  toggleTheme,
  logout,
  isLoading,
  invoicesListUrl,
}: DesktopNavbarProps) => (
  <div className="d-lg-flex flex-column flex-shrink-0 d-none bg-dark z-3 vh-100 position-fixed start-0 top-0 rounded-top-end-radius-lg rounded-bottom-end-radius-lg">
    <Link
      to={invoicesListUrl}
      className="d-block py-3 text-decoration-none bg-primary text-white text-center position-relative rounded-top-end-radius-lg rounded-bottom-end-radius-lg overflow-hidden"
    >
      <img
        src={logoSvg}
        className="my-1 position-relative z-2"
        alt="Invoicer logo - a circle with a missing slice"
      />
      <span className="visually-hidden user-select-none">Home</span>
      <div
        className="position-absolute start-50 top-100 translate-middle rounded-start-5 opacity-50"
        style={{
          width: "4.125rem",
          height: "4.125rem",
          backgroundColor: "#9277FF",
        }}
      ></div>
    </Link>
    <div className="mt-auto px-2 pb-2">
      <Stack direction="vertical" gap={3}>
        <OverlayTrigger
          placement="right"
          delay={TOOLTIP_SHOW}
          overlay={<Tooltip id="theme-toggle-tooltip">Toggle Theme</Tooltip>}
        >
          <Button
            variant="dark"
            className="rounded lh-1 pt-2"
            data-testid="theme-toggle"
            onClick={toggleTheme}
          >
            <Icon
              name={theme === "dark" ? "moon-stars-fill" : "sun-fill"}
              className="fs-4"
              aria-hidden="true"
            ></Icon>
          </Button>
        </OverlayTrigger>
        <OverlayTrigger
          placement="right"
          delay={TOOLTIP_SHOW}
          overlay={<Tooltip id="logout-tooltip">Logout</Tooltip>}
        >
          <Button
            variant="dark"
            className="rounded lh-1 pt-2"
            data-testid="logout"
            onClick={logout}
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner size="sm" color="body-emphasis"></Spinner>
            ) : (
              <Icon
                name="box-arrow-right"
                className="fs-4"
                aria-hidden="true"
              ></Icon>
            )}
          </Button>
        </OverlayTrigger>
      </Stack>
    </div>
  </div>
);

export default DesktopNavbar;
