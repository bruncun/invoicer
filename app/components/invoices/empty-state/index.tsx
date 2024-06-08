import { Col, Row } from "react-bootstrap";
import emptyStateIllustration from "~/assets/illustration-empty-state.svg";

const InvoicesEmptyState = () => (
  <div
    className="d-flex align-items-center justify-content-center flex-grow-1 mt-7 mt-lg-9"
    data-testid="empty-state"
  >
    <Row className="w-100">
      <Col
        xs={{ span: 10, offset: 1 }}
        lg={{ span: 5 }}
        className="text-center mx-lg-auto"
      >
        <img
          src={emptyStateIllustration}
          alt="An illustration of two empty clipboards"
          className="img-fluid mb-5"
        ></img>
        <h2 className="fs-5 mb-3">No invoices</h2>
        <p className="text-muted mb-7">Create a new invoice to get started.</p>
      </Col>
    </Row>
  </div>
);

export default InvoicesEmptyState;