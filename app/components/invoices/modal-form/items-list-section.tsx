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
import ConnectForm from "~/components/connect-form";

const ItemListSection = () => {
  const { control, watch } = useFormContext<InferType<typeof invoiceSchema>>();
  const items = watch("items");
  const itemsFieldArray = useItemsFieldArray(control);
  const { fields, append, remove } = itemsFieldArray;

  return (
    <ConnectForm>
      {({ control, register, formState: { errors } }) => (
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
                <Col
                  xs={{ span: 12 }}
                  xl={{ span: 4 }}
                  className="mb-3 mb-xl-0"
                >
                  <Field
                    control={control}
                    name={`items.${index}.name`}
                    label="Item Name"
                    register={register}
                    errors={errors}
                  />
                </Col>
                <Col xs={{ span: 3 }} xl={{ span: 2 }}>
                  <Field
                    control={control}
                    name={`items.${index}.quantity`}
                    label="Qty."
                    register={register}
                    errors={errors}
                    type="number"
                    min={1}
                  />
                </Col>
                <Col xs={{ span: 4 }} xl={{ span: 3 }}>
                  <Field
                    control={control}
                    name={`items.${index}.price`}
                    label="Price"
                    register={register}
                    errors={errors}
                    type="currency"
                  />
                </Col>
                <Col xs={{ span: 3 }} xl={{ span: 2 }}>
                  <Form.Group>
                    <Form.Label>Total</Form.Label>
                    <span className="mt-2 pt-1 border border-transparent d-block lh-1 fw-medium text-body-emphasis text-truncate">
                      {items[index].quantity &&
                        items[index].price &&
                        formatCurrency(
                          items[index].quantity * items[index].price
                        )}
                    </span>
                  </Form.Group>
                </Col>
                <Col
                  xs={{ span: 2 }}
                  xl={{ span: 1 }}
                  className="pt-2 justify-content-end d-flex"
                >
                  <div>
                    <OverlayTrigger
                      overlay={
                        <Tooltip id="delete-tooltip">Delete Item</Tooltip>
                      }
                    >
                      <Button
                        variant="link"
                        className="mt-4 border-0"
                        onClick={() => remove(index)}
                      >
                        <Icon name="trash"></Icon>
                        <span className="visually-hidden">Delete</span>
                      </Button>
                    </OverlayTrigger>
                  </div>
                </Col>
              </Row>
            </Stack>
          ))}
          <Button
            variant="secondary"
            className="w-100"
            onClick={() =>
              append({
                name: "",
                quantity: 1,
                price: 0,
                user_id: "",
              })
            }
          >
            <Icon name="plus-lg" className="me-2"></Icon>Add New Item
          </Button>
        </>
      )}
    </ConnectForm>
  );
};

export default ItemListSection;
