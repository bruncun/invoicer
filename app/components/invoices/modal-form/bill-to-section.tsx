import { Col, Row, Stack } from "react-bootstrap";
import ConnectForm from "~/components/connect-form";
import Field from "~/components/field";

const BillToSection = () => {
  const paymentTermsOptions = [
    { value: "30", label: "Net 30" },
    { value: "60", label: "Net 60" },
    { value: "90", label: "Net 90" },
  ];

  return (
    <ConnectForm>
      {({ register, formState: { errors }, control }) => (
        <>
          <h6 className="text-primary mb-2">Bill To</h6>
          <Stack gap={3} className="mb-5">
            <Field
              control={control}
              name="client_name"
              label="Client's Name"
              register={register}
              errors={errors}
            />
            <Field
              control={control}
              name="client_email"
              label="Client's Email"
              register={register}
              errors={errors}
            />
            <Field
              control={control}
              name="client_street"
              label="Street Address"
              register={register}
              errors={errors}
            />
            <Row className="gx-3">
              <Col xs={{ span: 6 }} xl={{ span: 4 }} className="mb-3 mb-xl-0">
                <Field
                  control={control}
                  name="client_city"
                  label="City"
                  register={register}
                  errors={errors}
                />
              </Col>
              <Col xs={{ span: 6 }} xl={{ span: 4 }} className="mb-3 mb-xl-0">
                <Field
                  control={control}
                  name="client_postcode"
                  label="Post Code"
                  register={register}
                  errors={errors}
                />
              </Col>
              <Col>
                <Field
                  control={control}
                  name="client_country"
                  label="Country"
                  register={register}
                  errors={errors}
                />
              </Col>
            </Row>
          </Stack>
          <Stack gap={3} className="mb-4">
            <Row className="gx-3">
              <Col>
                <Field
                  name="invoice_date"
                  type="date"
                  label="Invoice Date"
                  register={register}
                  control={control}
                  errors={errors}
                />
              </Col>
              <Col>
                <Field
                  type="select"
                  name="payment_terms"
                  label="Payment Terms"
                  options={paymentTermsOptions}
                  register={register}
                  control={control}
                  errors={errors}
                />
              </Col>
            </Row>
            <Field
              control={control}
              name="description"
              label="Project Description"
              register={register}
              errors={errors}
            />
          </Stack>
        </>
      )}
    </ConnectForm>
  );
};

export default BillToSection;
