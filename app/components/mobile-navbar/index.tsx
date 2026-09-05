import { Button } from "react-bootstrap";
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
  <nav className="navbar navbar-expand-lg bg-dark fixed-top d-lg-none z-3 rounded-bottom-4 rounded-bottom-md-0">
    <Link
      className="navbar-brand bg-primary text-white p-3 lh-1 border-top border-bottom border-transparent position-relative overflow-hidden rounded-bottom-start-4 rounded-bottom-end-4"
      to={invoicesListUrl}
    >
      <img
        src={logoSvg}
        width={28}
        height={26}
        className="position-relative z-2"
        alt="Invoicer logo - a circle with a missing slice"
      />
      <span className="visually-hidden user-select-none">Home</span>
      <div
        className="position-absolute start-50 top-100 translate-middle rounded-start-5 opacity-50"
        style={{
          width: "3.75rem",
          height: "3.75rem",
          backgroundColor: "#9277FF",
        }}
      ></div>
    </Link>
    <div className="navbar-nav flex-row align-items-center me-3">
      <div>
        <Button
          variant="dark"
          className="rounded d-flex align-items-center justify-content-center p-0 me-2"
          style={{ width: "2.5rem", height: "2.5rem" }}
          data-testid="theme-toggle"
          onClick={toggleTheme}
        >
          <Icon
            name={theme === "dark" ? "moon-stars-fill" : "sun-fill"}
            className="fs-5"
          ></Icon>
          <span className="visually-hidden">Toggle theme</span>
        </Button>
      </div>
      <div>
        <Button
          variant="dark"
          className="rounded d-flex align-items-center justify-content-center p-0"
          style={{ width: "2.5rem", height: "2.5rem" }}
          data-testid="logout"
          onClick={logout}
          disabled={isLoading}
        >
          {isLoading ? (
            <span
              role="status"
              className="spinner-border spinner-border-sm text-body-emphasis"
            />
          ) : (
            <Icon name="box-arrow-right" className="fs-4"></Icon>
          )}
          <span className="visually-hidden">Log out</span>
        </Button>
      </div>
    </div>
  </nav>
);

export default MobileNavbar;
