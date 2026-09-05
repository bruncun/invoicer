import Field from "~/components/field";
import InvoiceFormField from "~/components/invoice-form-field";

const BillToSection = () => {
  const paymentTermsOptions = [
    { value: "30", label: "Net 30" },
    { value: "60", label: "Net 60" },
    { value: "90", label: "Net 90" },
  ];

  return (
    <>
      <h6 className="text-primary mb-2">Bill To</h6>
      <div className="vstack gap-3 mb-5">
        <Field name="client_name" label="Client's Name" />
        <Field name="client_email" label="Client's Email" />
        <Field name="client_street" label="Street Address" />
        <div className="row gx-3">
          <div className="col-6 col-xl-4 mb-3 mb-xl-0">
            <Field name="client_city" label="City" />
          </div>
          <div className="col-6 col-xl-4 mb-3 mb-xl-0">
            <Field name="client_postcode" label="Post Code" />
          </div>
          <div className="col">
            <Field name="client_country" label="Country" />
          </div>
        </div>
      </div>
      <div className="vstack gap-3 mb-4">
        <div className="row gx-3">
          <div className="col">
            <InvoiceFormField
              name="invoice_date"
              type="date"
              label="Invoice Date"
            />
          </div>
          <div className="col">
            <InvoiceFormField
              type="select"
              name="payment_terms"
              label="Payment Terms"
              options={paymentTermsOptions}
            />
          </div>
        </div>
        <Field name="description" label="Project Description" />
      </div>
    </>
  );
};

export default BillToSection;
