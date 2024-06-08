import { Button, Nav, Navbar, Spinner } from "react-bootstrap";
import Icon from "../icon";
import { Link } from "@remix-run/react";

type MobileNavbarProps = {
  theme: string;
  toggleTheme: () => void;
  logout: () => void;
  isLoading: boolean;
  invoicesListUrl: string;
};

const MobileNavbar = ({
  theme,
  invoicesListUrl,
  toggleTheme,
  logout,
  isLoading,
}: MobileNavbarProps) => (
  <Navbar expand="lg" bg="dark" className="d-lg-none" fixed="top">
    <Navbar.Brand
      className="bg-primary text-white p-3 lh-1"
      as={Link}
      to={invoicesListUrl}
    >
      <Icon name="receipt-cutoff" className="fs-lg-1 fs-2"></Icon>
    </Navbar.Brand>
    <Nav className="flex-row me-3">
      <Nav.Item>
        <Button
          variant="dark"
          className="rounded lh-1 pt-2 me-2"
          data-testid="theme-toggle"
          onClick={toggleTheme}
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
          onClick={logout}
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner size="sm" color="body-emphasis"></Spinner>
          ) : (
            <Icon name="box-arrow-right" className="fs-4"></Icon>
          )}
        </Button>
      </Nav.Item>
    </Nav>
  </Navbar>
);

export default MobileNavbar;
