import { Col, Container, Row } from "react-bootstrap";
import { PropsWithChildren } from "react";
import { Menu } from "../menu";

export const Layout = ({
  children,
  state,
}: PropsWithChildren & { state: any }) => (
  <>
    <div className="d-lg-flex flex-nowrap vh-lg-100">
      <Menu></Menu>
      <div className="py-3 py-lg-4 w-100 layout-container overflow-y-scroll">
        <Container className="d-flex flex-column flex-grow-1">
          <Row className="h-100">
            <Col sm={{ span: 8, offset: 2 }} className="h-100 mt-lg-3">
              {children}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  </>
);
