import {
  Button,
  OverlayTrigger,
  Spinner,
  Stack,
  Tooltip,
} from "react-bootstrap";
import Icon from "../icon";
import { Link } from "@remix-run/react";
import { TOOLTIP_DELAY } from "~/constants";
import useFilterPagination from "~/hooks/invoices/use-filter-pagination";

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
}: DesktopNavbarProps) => {
  const {
    currentPage,
    pageSize,
    filters,
    setCurrentPage,
    setPageSize,
    setFilters,
  } = useFilterPagination();

  return (
    <div className="d-xl-flex flex-column flex-shrink-0 d-none bg-dark z-3 vh-100 shadow-xl position-fixed start-0 top-0">
      <Link
        to={invoicesListUrl}
        className="d-block py-3 text-decoration-none bg-primary text-white text-center position-relative"
      >
        <Icon name="receipt-cutoff" className="fs-2 lh-1"></Icon>
        <span className="visually-hidden user-select-none">Home</span>
      </Link>
      <div className="mt-auto px-2 pb-3">
        <Stack direction="vertical" gap={3}>
          <OverlayTrigger
            delay={TOOLTIP_DELAY}
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
            delay={TOOLTIP_DELAY}
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

export default DesktopNavbar;
