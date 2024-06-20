import { Col, Container, Row } from "react-bootstrap";
import { PropsWithChildren } from "react";
import { useLogout, useNavigation } from "@refinedev/core";
import useTheme from "~/hooks/use-theme";
import DesktopNavbar from "../desktop-navbar";
import MobileNavbar from "../mobile-navbar";

const Layout = ({ children }: PropsWithChildren) => {
  const { theme, toggleTheme } = useTheme();
  const { mutate, isLoading } = useLogout();
  const { listUrl } = useNavigation();
  const invoicesListUrl = listUrl("invoices");

  return (
    <div className={`layout min-vh-100`}>
      <MobileNavbar
        theme={theme}
        toggleTheme={toggleTheme}
        logout={mutate}
        isLoading={isLoading}
        invoicesListUrl={invoicesListUrl}
      ></MobileNavbar>
      <DesktopNavbar
        theme={theme}
        toggleTheme={toggleTheme}
        logout={mutate}
        isLoading={isLoading}
        invoicesListUrl={invoicesListUrl}
      ></DesktopNavbar>
      <Container className="py-3 py-xl-3 w-100 position-xl-relative layout-container">
        <Row>
          <Col xl={{ span: 10, offset: 1 }}>{children}</Col>
        </Row>
      </Container>
    </div>
  );
};

export default Layout;
