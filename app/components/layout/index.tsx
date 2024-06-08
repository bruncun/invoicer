import { Col, Container, Row } from "react-bootstrap";
import { PropsWithChildren } from "react";
import { useLogout, useNavigation } from "@refinedev/core";
import useTheme from "~/hooks/use-theme";
import DesktopNav from "../desktop-navbar";
import MobileNavbar from "../mobile-navbar";

const Layout = ({ children }: PropsWithChildren) => {
  const { theme, toggleTheme } = useTheme();
  const { mutate, isLoading } = useLogout();
  const { listUrl } = useNavigation();
  const invoicesListUrl = listUrl("invoices");

  return (
    <div className="d-lg-flex flex-nowrap">
      <MobileNavbar
        theme={theme}
        invoicesListUrl={invoicesListUrl}
      ></MobileNavbar>
      <DesktopNav
        theme={theme}
        toggleTheme={toggleTheme}
        logout={mutate}
        isLoading={isLoading}
        invoicesListUrl={invoicesListUrl}
      ></DesktopNav>
      <div className="py-3 py-lg-4 w-100 overflow-y-scroll vh-100 position-relative">
        <Container className="d-flex flex-column flex-grow-1">
          <Row className="h-100">
            <Col sm={{ span: 8, offset: 2 }} className="h-100 mt-lg-3">
              {children}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Layout;
