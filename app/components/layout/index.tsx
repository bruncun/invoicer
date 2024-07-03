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
    <div className={`layout ps-xl-navbar position-relative`}>
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
      <Container className="py-3 py-xl-4 w-100">
        <Row>
          <Col xl={{ span: 8, offset: 2 }}>{children}</Col>
        </Row>
      </Container>
    </div>
  );
};

export default Layout;
