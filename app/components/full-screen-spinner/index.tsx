import { Row, Col, Spinner } from "react-bootstrap";

const FullScreenSpinner = () => (
  <div
    className="position-absolute top-0 start-0 d-flex justify-content-center align-items-center w-100 h-100"
    data-testid="loading"
  >
    <Row className="w-100">
      <Col xs={{ span: 6, offset: 3 }} className="text-center">
        <Spinner variant="primary" className="mb-4"></Spinner>
        <h2 className="fs-5">Loading...</h2>
      </Col>
    </Row>
  </div>
);

export default FullScreenSpinner;
