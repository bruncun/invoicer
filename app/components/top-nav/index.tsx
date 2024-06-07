import { Button, Nav, Navbar } from "react-bootstrap";
import Icon from "../icon";
import { Link } from "@remix-run/react";

type TopNavProps = {
  theme: string;
  invoicesListUrl: string;
};

const TopNav = ({ theme, invoicesListUrl }: TopNavProps) => (
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
);

export default TopNav;
