import {
  Alert,
  Stack,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
  Button,
  Form,
} from "react-bootstrap";
import { useFormContext } from "react-hook-form";
import { InferType } from "yup";
import Icon from "~/components/icon";
import { invoiceSchema } from "~/constants";
import useItemsFieldArray from "~/hooks/invoices/use-items-field-array";
import { formatCurrency } from "~/utility/formatters";
import Field from "~/components/field";

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
        <Alert variant="danger">
          {(errors as any)?.items?.root?.message as string}
        </Alert>
      )}
      {fields.map((item, index) => (
        <Stack key={item.id} gap={3} className="mb-4">
          <Row className="gx-3">
            <Col xs={{ span: 12 }} xl={{ span: 4 }} className="mb-3 mb-xl-0">
              <Field name={`items.${index}.name`} label="Item Name" />
            </Col>
            <Col xs={{ span: 3 }} xl={{ span: 2 }}>
              <Field
                name={`items.${index}.quantity`}
                label="Quantity"
                type="number"
                min={1}
              />
            </Col>
            <Col xs={{ span: 4 }} xl={{ span: 3 }}>
              <Field
                name={`items.${index}.price`}
                label="Price"
                type="currency"
              />
            </Col>
            <Col xs={{ span: 3 }} xl={{ span: 2 }}>
              <Form.Group>
                <Form.Label>Total</Form.Label>
                <span
                  className="d-block text-body-emphasis text-truncate"
                  style={{ paddingTop: "0.4375rem" }}
                >
                  {formatCurrency(items[index].quantity * items[index].price)}
                </span>
              </Form.Group>
            </Col>
            <Col
              xs={{ span: 2 }}
              xl={{ span: 1 }}
              className="pt-2 justify-content-end d-flex"
            >
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
            </Col>
          </Row>
        </Stack>
      ))}
      <Button variant="secondary" className="w-100" onClick={onNewItemClick}>
        <Icon name="plus-lg" className="me-2" aria-hidden="true" />
        Add New Item
      </Button>
    </>
  );
};

export default ItemListSection;
