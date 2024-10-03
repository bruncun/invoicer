import { Col, Row } from "react-bootstrap";
import emptyStateIllustration from "~/assets/illustration-empty-state.svg";

const InvoicesEmptyState = () => (
  <div
    className="d-flex align-items-center justify-content-center flex-grow-1 mt-7 mt-xl-9"
    data-testid="empty-state"
  >
    <Row className="w-100">
      <Col
        xs={{ span: 9 }}
        sm={{ span: 7 }}
        md={{ span: 5 }}
        lg={{ span: 4 }}
        xl={{ span: 5 }}
        className="text-center mx-auto"
      >
        <img
          src={emptyStateIllustration}
          alt="An illustration of a person standing in a envelope. They are holding a speakerphone and are surrounded by floating envelopes and paper airplanes."
          className="img-fluid mb-5"
        ></img>
        <h2 className="fs-5 mb-3">No invoices</h2>
        <p className="text-muted mb-7">Start by creating a new invoice.</p>
      </Col>
    </Row>
  </div>
);

export default InvoicesEmptyState;
