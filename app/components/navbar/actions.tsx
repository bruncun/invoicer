import type { ReactElement } from "react";
import { Form, useNavigation } from "@remix-run/react";
import { Button } from "react-bootstrap";
import Icon from "~/components/icon";

export type NavbarActionsProps = {
  theme: string;
  toggleTheme: () => void;
};

type NavbarActionsWithWrapperProps = NavbarActionsProps & {
  wrap?: (action: "theme" | "logout", button: ReactElement) => ReactElement;
};

export default function NavbarActions({
  theme,
  toggleTheme,
  wrap,
}: NavbarActionsWithWrapperProps) {
  const navigation = useNavigation();
  const isLoggingOut =
    navigation.state === "submitting" && navigation.formAction === "/logout";

  const themeButton = (
    <Button
      variant="dark"
      className="app-navbar-theme-button rounded d-flex align-items-center justify-content-center p-0"
      style={{ width: "2.5rem", height: "2.5rem" }}
      data-testid="theme-toggle"
      onClick={toggleTheme}
    >
      <Icon
        name={theme === "dark" ? "moon-stars-fill" : "sun-fill"}
        className="app-navbar-theme-icon"
        aria-hidden="true"
      />
      <span className="visually-hidden">Toggle theme</span>
    </Button>
  );

  const logoutButton = (
    <Form action="/logout" method="post">
      <Button
        variant="dark"
        type="submit"
        className="rounded d-flex align-items-center justify-content-center p-0"
        style={{ width: "2.5rem", height: "2.5rem" }}
        data-testid="logout"
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <span
            role="status"
            className="spinner-border spinner-border-sm text-white"
          />
        ) : (
          <Icon name="box-arrow-right" className="fs-4" aria-hidden="true" />
        )}
        <span className="visually-hidden">Log out</span>
      </Button>
    </Form>
  );

  return (
    <>
      {wrap ? wrap("theme", themeButton) : themeButton}
      {wrap ? wrap("logout", logoutButton) : logoutButton}
    </>
  );
}
