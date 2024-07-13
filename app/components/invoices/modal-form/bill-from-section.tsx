import { Col, Row, Stack } from "react-bootstrap";
import Field from "~/components/field";

const BillFromSection = () => (
  <>
    <h6 className="text-primary mb-2">Bill From</h6>
    <Field name="user_id" type="hidden" />
    <Field name="payment_due" type="hidden" />
    <Stack gap={3} className="mb-5">
      <Field
        autoComplete="address"
        name="sender_street"
        label="Street Address"
      />
      <Row className="gx-3">
        <Col xs={{ span: 6 }} xl={{ span: 4 }} className="mb-3 mb-xl-0">
          <Field
            autoComplete="address-level2"
            name="sender_city"
            label="City"
          />
        </Col>
        <Col xs={{ span: 6 }} xl={{ span: 4 }} className="mb-3 mb-xl-0">
          <Field
            name="sender_postcode"
            autoComplete="postal-code"
            label="Post Code"
          />
        </Col>
        <Col>
          <Field name="sender_country" autoComplete="country" label="Country" />
        </Col>
      </Row>
    </Stack>
  </>
);

export default BillFromSection;
