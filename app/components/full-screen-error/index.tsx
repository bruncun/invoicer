import { Col, Container, Row } from "react-bootstrap";
import authLogo from "~/assets/auth-logo.svg";

const FullScreenError = () => (
  <div className="light-bg-gray-100 dark-bg-gray-950 min-vh-100 d-flex align-items-center">
    <Container>
      <Row>
        <Col xs={12} md={8} lg={6} xl={5} className="mx-auto">
          <div className="text-center mb-4">
            <img
              src={authLogo}
              alt="Invoicer"
              title="Invoicer"
              className="mb-4"
            />
            <p className="text-primary fw-semibold text-uppercase small mb-2">
              Something went wrong
            </p>
            <h1 className="fs-3 text-body-emphasis mb-2">
              We could not load <br className="d-sm-none" />this page
            </h1>
            <p className="text-muted mb-0">Sorry, please try again.</p>
          </div>
        </Col>
      </Row>
    </Container>
  </div>
);

export default FullScreenError;
