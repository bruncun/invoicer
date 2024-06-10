import { Row, Col } from "react-bootstrap";

const FullScreenError = () => (
  <div
    className="position-absolute top-50 start-50 translate-middle w-100"
    data-testid="loading"
  >
    <Row>
      <Col xs={{ span: 6, offset: 3 }} className="text-center">
        <h2 className="fs-5">Oops, something went wrong.</h2>
      </Col>
    </Row>
  </div>
);

export default FullScreenError;
