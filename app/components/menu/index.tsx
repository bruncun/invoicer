import {
  Button,
  Nav,
  Navbar,
  OverlayTrigger,
  Spinner,
  Stack,
  Tooltip,
} from "react-bootstrap";
import { Icon } from "../icon";
import useTheme from "~/hooks/use-theme";
import { useLogout } from "@refinedev/core";

export const Menu = () => {
  const { theme, toggleTheme } = useTheme();
  const { mutate, isLoading } = useLogout();

  return (
    <>
      <div className="d-lg-flex flex-column flex-shrink-0 d-none bg-dark z-3 vh-100 shadow-lg">
        <a
          href="/"
          className="d-block px-3 py-2 link-body-emphasis text-decoration-none bg-primary text-white text-center position-relative btn-shadow border border-primary"
        >
          <Icon name="receipt-cutoff" className="fs-3"></Icon>

          <span className="visually-hidden">Icon-only</span>
        </a>
        <div className="mt-auto px-3 pb-3">
          <Stack direction="vertical" gap={3}>
            <OverlayTrigger
              delay={{ show: 250, hide: 400 }}
              overlay={
                <Tooltip id="theme-toggle-tooltip">Toggle Theme</Tooltip>
              }
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
              delay={{ show: 250, hide: 400 }}
              overlay={<Tooltip id="logout-tooltip">Logout</Tooltip>}
            >
              <Button
                variant="dark"
                className="rounded lh-1 pt-2"
                data-testid="logout"
                onClick={() => mutate()}
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
      <Navbar expand="lg" bg="dark" className="d-lg-none" fixed="top">
        <Navbar.Brand className="bg-primary text-white p-3 lh-1">
          <Icon name="receipt-cutoff" className="fs-lg-1 fs-2"></Icon>
        </Navbar.Brand>
        <Nav className="flex-row me-3">
          <Nav.Item>
            <Button
              variant="dark"
              className="rounded lh-1 pt-2 me-2"
              data-testid="theme-toggle"
            >
              <Icon
                name={theme === "dark" ? "moon-stars-fill" : "sun-fill"}
                className="fs-5"
              ></Icon>
            </Button>
          </Nav.Item>
          <Nav.Item>
            <Button
              variant="dark"
              className="rounded lh-1 pt-2"
              data-testid="logout"
            >
              <Icon name="box-arrow-right" className="fs-5"></Icon>
            </Button>
          </Nav.Item>
        </Nav>
      </Navbar>
    </>
  );
};
