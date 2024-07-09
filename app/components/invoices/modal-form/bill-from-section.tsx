import { Col, Row, Stack } from "react-bootstrap";
import ConnectForm from "~/components/connect-form";
import Field from "~/components/field";

const BillFromSection = () => (
  <ConnectForm>
    {({ register, formState: { errors }, control }) => (
      <>
        <h6 className="text-primary mb-2">Bill From</h6>
        <input type="hidden" {...register("user_id")} />
        <input type="hidden" {...register("payment_due")} />
        <Stack gap={3} className="mb-5">
          <Field
            control={control}
            autoComplete="address"
            name="sender_street"
            label="Street Address"
            register={register}
            errors={errors}
          />
          <Row className="gx-3">
            <Col xs={{ span: 6 }} xl={{ span: 4 }} className="mb-3 mb-xl-0">
              <Field
                control={control}
                autoComplete="address-level2"
                name="sender_city"
                label="City"
                register={register}
                errors={errors}
              />
            </Col>
            <Col xs={{ span: 6 }} xl={{ span: 4 }} className="mb-3 mb-xl-0">
              <Field
                control={control}
                name="sender_postcode"
                autoComplete="postal-code"
                label="Post Code"
                register={register}
                errors={errors}
              />
            </Col>
            <Col>
              <Field
                control={control}
                name="sender_country"
                autoComplete="country"
                label="Country"
                register={register}
                errors={errors}
              />
            </Col>
          </Row>
        </Stack>
      </>
    )}
  </ConnectForm>
);

export default BillFromSection;
