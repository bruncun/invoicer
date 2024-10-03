import { Button, Nav, Navbar, Spinner } from "react-bootstrap";
import Icon from "../icon";
import { Link } from "@remix-run/react";
import logoSvg from "~/assets/logo.svg";

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
  <Navbar expand="xl" bg="dark" className="d-xl-none z-2" fixed="top">
    <Navbar.Brand
      className="bg-primary text-white p-3 lh-1 border-top border-bottom border-transparent"
      as={Link}
      to={invoicesListUrl}
    >
      <img
        src={logoSvg}
        alt="Invoicer logo - a circle with a missing slice."
        className="d-block"
      />
      <span className="visually-hidden user-select-none">Home</span>
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
