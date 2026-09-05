import Field from "~/components/field";

const BillFromSection = () => (
  <>
    <h6 className="text-primary mb-2">Bill From</h6>
    <div className="vstack gap-3 mb-5">
      <Field
        autoComplete="address"
        name="sender_street"
        label="Street Address"
      />
      <div className="row gx-3">
        <div className="col-6 col-xl-4 mb-3 mb-xl-0">
          <Field
            autoComplete="address-level2"
            name="sender_city"
            label="City"
          />
        </div>
        <div className="col-6 col-xl-4 mb-3 mb-xl-0">
          <Field
            name="sender_postcode"
            autoComplete="postal-code"
            label="Post Code"
          />
        </div>
        <div className="col">
          <Field name="sender_country" autoComplete="country" label="Country" />
        </div>
      </div>
    </div>
  </>
);

export default BillFromSection;
