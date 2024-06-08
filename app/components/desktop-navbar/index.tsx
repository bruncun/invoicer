import {
  Button,
  OverlayTrigger,
  Spinner,
  Stack,
  Tooltip,
} from "react-bootstrap";
import Icon from "../icon";
import { Link } from "@remix-run/react";

type DesktopNav = {
  theme: string;
  toggleTheme: () => void;
  logout: () => void;
  isLoading: boolean;
  invoicesListUrl: string;
};

const DesktopNav = ({
  theme,
  toggleTheme,
  logout,
  isLoading,
  invoicesListUrl,
}: DesktopNav) => {
  return (
    <div className="d-lg-flex flex-column flex-shrink-0 d-none bg-dark z-3 vh-100 shadow-lg position-fixed start-0 top-0">
      <Link
        to={invoicesListUrl}
        className="d-block px-3 py-2 text-decoration-none bg-primary text-white text-center position-relative btn-shadow border border-primary"
      >
        <Icon name="receipt-cutoff" className="fs-2"></Icon>

        <span className="visually-hidden">Icon-only</span>
      </Link>
      <div className="mt-auto px-3 pb-3">
        <Stack direction="vertical" gap={3}>
          <OverlayTrigger
            delay={{ show: 500, hide: 0 }}
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
              ></Icon>
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            delay={{ show: 500, hide: 0 }}
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
                <Icon name="box-arrow-right" className="fs-4"></Icon>
              )}
            </Button>
          </OverlayTrigger>
        </Stack>
      </div>
    </div>
  );
};

export default DesktopNav;
