import type { ReactElement } from "react";
import { Button } from "react-bootstrap";
import Icon from "../icon";

export type DesktopNavbarActionsProps = {
  theme: string;
  toggleTheme: () => void;
  logout: () => void;
  isLoading: boolean;
};

type DesktopNavbarActionsPropsWithWrapper = DesktopNavbarActionsProps & {
  wrap?: (action: "theme" | "logout", button: ReactElement) => ReactElement;
};

export default function DesktopNavbarActions({
  theme,
  toggleTheme,
  logout,
  isLoading,
  wrap,
}: DesktopNavbarActionsPropsWithWrapper) {
  const themeButton = (
    <Button
      variant="dark"
      className="rounded d-flex align-items-center justify-content-center p-0"
      style={{ width: "2.5rem", height: "2.5rem" }}
      data-testid="theme-toggle"
      onClick={toggleTheme}
    >
      <Icon
        name={theme === "dark" ? "moon-stars-fill" : "sun-fill"}
        className="fs-4"
        aria-hidden="true"
      ></Icon>
      <span className="visually-hidden">Toggle theme</span>
    </Button>
  );

  const logoutButton = (
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
        <Icon name="box-arrow-right" className="fs-4" aria-hidden="true" />
      )}
      <span className="visually-hidden">Log out</span>
    </Button>
  );

  return (
    <>
      {wrap ? wrap("theme", themeButton) : themeButton}
      {wrap ? wrap("logout", logoutButton) : logoutButton}
    </>
  );
}
