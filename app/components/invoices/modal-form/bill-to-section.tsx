import { Col, Row, Stack } from "react-bootstrap";
import Field from "~/components/field";

const BillToSection = () => {
  const paymentTermsOptions = [
    { value: "30", label: "Net 30" },
    { value: "60", label: "Net 60" },
    { value: "90", label: "Net 90" },
  ];

  return (
    <>
      <h6 className="text-primary mb-2">Bill To</h6>
      <Stack gap={3} className="mb-5">
        <Field name="client_name" label="Client's Name" />
        <Field name="client_email" label="Client's Email" />
        <Field name="client_street" label="Street Address" />
        <Row className="gx-3">
          <Col xs={{ span: 6 }} xl={{ span: 4 }} className="mb-3 mb-xl-0">
            <Field name="client_city" label="City" />
          </Col>
          <Col xs={{ span: 6 }} xl={{ span: 4 }} className="mb-3 mb-xl-0">
            <Field name="client_postcode" label="Post Code" />
          </Col>
          <Col>
            <Field name="client_country" label="Country" />
          </Col>
        </Row>
      </Stack>
      <Stack gap={3} className="mb-4">
        <Row className="gx-3">
          <Col>
            <Field name="invoice_date" type="date" label="Invoice Date" />
          </Col>
          <Col>
            <Field
              type="select"
              name="payment_terms"
              label="Payment Terms"
              options={paymentTermsOptions}
            />
          </Col>
        </Row>
        <Field name="description" label="Project Description" />
      </Stack>
    </>
  );
};

export default BillToSection;
