import { Col, Row } from "react-bootstrap";
import emptyStateIllustration from "~/assets/illustration-empty-state.svg";

export const InvoicesEmptyState = () => (
  <div
    className="d-flex flex-grow-1 align-items-center justify-content-center h-100"
    data-testid="empty-state"
  >
    <Row>
      <Col xs={{ span: 6, offset: 3 }} className="text-center">
        <img
          src={emptyStateIllustration}
          alt="An illustration of two empty clipboards"
          className="img-fluid mb-5"
        ></img>
        <h2 className="fs-5 mb-3">No invoices</h2>
        <p className="text-muted">Create a new invoice to get started.</p>
      </Col>
    </Row>
  </div>
);
