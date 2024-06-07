import { Col, Container, Row } from "react-bootstrap";
import { PropsWithChildren } from "react";
import { Menu } from "../menu";

export const Layout = ({ children }: PropsWithChildren) => (
  <>
    <div className="d-lg-flex flex-nowrap">
      <Menu></Menu>
      <div className="py-3 py-lg-4 w-100 layout-container overflow-y-scroll vh-100 position-relative">
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
