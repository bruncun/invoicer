import {
  OverlayTrigger,
  Tooltip,
  Button,
  Form,
} from "react-bootstrap";
import { useFormContext } from "react-hook-form";
import type { InferType } from "yup";
import Icon from "~/components/icon";
import { invoiceSchema } from "~/constants/schemas";
import useItemsFieldArray from "~/hooks/invoices/use-items-field-array";
import { formatCurrency } from "~/utility/formatters";
import Field from "~/components/field";
import InvoiceFormField from "~/components/invoice-form-field";

const ItemListSection = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<InferType<typeof invoiceSchema>>();
  const items = watch("items");
  const { fields, append, remove } = useItemsFieldArray(control);

  const onNewItemClick = () => append({ name: "", quantity: 1, price: 0 });

  return (
    <>
      <h5 className="text-muted mb-3 lh-lg">Item List</h5>
      {errors.items?.root && (
        <div role="alert" className="alert alert-danger">
          {(errors as any)?.items?.root?.message as string}
        </div>
      )}
      {fields.map((item, index) => (
        <div key={item.id} className="vstack gap-3 mb-4">
          <div className="row gx-3">
            <div className="col-12 col-xl-4 mb-3 mb-xl-0">
              <Field name={`items.${index}.name`} label="Item Name" />
            </div>
            <div className="col-3 col-xl-2">
              <Field
                name={`items.${index}.quantity`}
                label="Quantity"
                type="number"
                min={1}
              />
            </div>
            <div className="col-4 col-xl-3">
              <InvoiceFormField
                name={`items.${index}.price`}
                label="Price"
                type="currency"
              />
            </div>
            <div className="col-3 col-xl-2">
              <Form.Group>
                <Form.Label>Total</Form.Label>
                <span
                  className="d-block text-body-emphasis text-truncate"
                  style={{ paddingTop: "0.4375rem" }}
                >
                  {formatCurrency(items[index].quantity * items[index].price)}
                </span>
              </Form.Group>
            </div>
            <div className="col-2 col-xl-1 pt-2 justify-content-end d-flex">
              <OverlayTrigger
                overlay={<Tooltip id="delete-tooltip">Delete Item</Tooltip>}
              >
                <Button
                  variant="link"
                  className="mt-4 border-0"
                  onClick={() => remove(index)}
                >
                  <Icon name="trash" aria-hidden="true"></Icon>
                </Button>
              </OverlayTrigger>
            </div>
          </div>
        </div>
      ))}
      <Button variant="secondary" className="w-100" onClick={onNewItemClick}>
        <Icon name="plus-lg" className="me-2" aria-hidden="true" />
        Add New Item
      </Button>
    </>
  );
};

export default ItemListSection;
