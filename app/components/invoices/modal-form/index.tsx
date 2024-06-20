import {
  Modal,
  Button,
  Form,
  Stack,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
} from "react-hook-form";
import { Asserts } from "yup";
import Icon from "~/components/icon";
import { TOOLTIP_DELAY, invoiceSchema } from "~/constants";
import { Status } from "~/types/invoices";
import { Tables } from "~/types/supabase";
import { formatCurrency } from "~/utility/formatters";

type InvoicesModalFormProps = {
  close: () => void;
  visible: boolean;
  handleSubmit: UseFormHandleSubmit<Asserts<typeof invoiceSchema>, undefined>;
  onSubmit: (status: Status) => void;
  onFinish: (formData: Asserts<typeof invoiceSchema>) => Promise<void>;
  fields: FieldArrayWithId<Asserts<typeof invoiceSchema>, "items", "id">[];
  append: UseFieldArrayAppend<Asserts<typeof invoiceSchema>, "items">;
  isSubmitting: boolean;
  remove: UseFieldArrayRemove;
  register: UseFormRegister<Asserts<typeof invoiceSchema>>;
  items: Tables<"items">[];
  title: string;
  reset?: UseFormReset<Asserts<typeof invoiceSchema>>;
  errors: FieldErrors<Asserts<typeof invoiceSchema>>;
};

const InvoicesModalForm = ({
  close,
  reset,
  visible,
  handleSubmit,
  onSubmit,
  onFinish,
  fields,
  append,
  isSubmitting,
  register,
  title,
  items,
  remove,
  errors,
}: InvoicesModalFormProps) => (
  <Modal
    show={visible}
    fullscreen="md-down"
    onHide={() => {
      if (reset) reset();
      close();
    }}
    className="z-2"
    dialogClassName="ms-sm-0 mt-0 mb-0 min-vh-lg-100"
    contentClassName="rounded-start-0 ps-xl-6"
    scrollable
  >
    <Modal.Header className="px-4 py-3">
      <Modal.Title className="lh-1 border-top border-transparent py-1 fs-xl-4">
        {title}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body className="p-4">
      <form id="invoice-form" onSubmit={handleSubmit(onFinish)}>
        <input type="hidden" {...register("user_id")} />
        <h6 className="text-primary mb-2">Bill From</h6>
        <Stack gap={3} className="mb-4">
          <Form.Group>
            <Form.Label htmlFor="sender_street">Street Address</Form.Label>
            <Form.Control
              autoComplete="address"
              isInvalid={!!errors.sender_street}
              id="sender_street"
              {...register("sender_street")}
            />
            <Form.Control.Feedback type="invalid">
              {(errors as any)?.sender_street?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Row className="gx-3">
            <Col>
              <Form.Group>
                <Form.Label htmlFor="sender_city">City</Form.Label>
                <Form.Control
                  autoComplete="address-level2"
                  isInvalid={!!errors.sender_city}
                  id="sender_city"
                  {...register("sender_city")}
                />
                <Form.Control.Feedback type="invalid">
                  {(errors as any)?.sender_street?.message as string}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label htmlFor="sender_postcode">Post Code</Form.Label>
                <Form.Control
                  type="tel"
                  autoComplete="postal-code"
                  isInvalid={!!errors.sender_postcode}
                  id="sender_postcode"
                  {...register("sender_postcode")}
                />
                <Form.Control.Feedback type="invalid">
                  {(errors as any)?.sender_postcode?.message as string}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label htmlFor="sender_country">Country</Form.Label>
                <Form.Control
                  autoComplete="country"
                  isInvalid={!!errors.sender_country}
                  id="sender_country"
                  {...register("sender_country")}
                />
                <Form.Control.Feedback type="invalid">
                  {(errors as any)?.sender_country?.message as string}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Stack>
        <h6 className="text-primary mb-2">Bill To</h6>
        <Stack gap={3} className="mb-5">
          <Form.Group>
            <Form.Label htmlFor="client_name">Client's Name</Form.Label>
            <Form.Control
              {...register("client_name")}
              id="client_name"
              isInvalid={!!errors.client_name}
            />
            <Form.Control.Feedback type="invalid">
              {(errors as any)?.client_name?.message as string}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="client_email">Client's Email</Form.Label>
            <Form.Control
              {...register("client_email")}
              id="client_email"
              isInvalid={!!errors.client_email}
            />
            <Form.Control.Feedback type="invalid">
              {(errors as any)?.client_email?.message as string}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="client_street">Street Address</Form.Label>
            <Form.Control
              {...register("client_street")}
              id="client_street"
              isInvalid={!!errors.client_street}
            />
            <Form.Control.Feedback type="invalid">
              {(errors as any)?.client_street?.message as string}
            </Form.Control.Feedback>
          </Form.Group>
          <Row className="gx-3">
            <Col>
              <Form.Group>
                <Form.Label htmlFor="client_city">City</Form.Label>
                <Form.Control
                  {...register("client_city")}
                  id="client_city"
                  isInvalid={!!errors.client_city}
                />
                <Form.Control.Feedback type="invalid">
                  {(errors as any)?.client_city?.message as string}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label htmlFor="client_postcode">Post Code</Form.Label>
                <Form.Control
                  type="tel"
                  id="client_postcode"
                  isInvalid={!!errors.client_postcode}
                  {...register("client_postcode")}
                />
                <Form.Control.Feedback type="invalid">
                  {(errors as any)?.client_postcode?.message as string}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label htmlFor="client_country">Country</Form.Label>
                <Form.Control
                  id="client_country"
                  isInvalid={!!errors.client_country}
                  {...register("client_country")}
                />
                <Form.Control.Feedback type="invalid">
                  {(errors as any)?.client_country?.message as string}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row className="gx-3">
            <Col>
              <Form.Group>
                <Form.Label htmlFor="payment_due">Invoice Date</Form.Label>
                <Form.Control
                  id="payment_due"
                  isInvalid={!!errors.payment_due}
                  {...register("payment_due")}
                  type="date"
                />
                <Form.Control.Feedback type="invalid">
                  {(errors as any)?.payment_due?.message as string}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label htmlFor="payment_terms">Payment Terms</Form.Label>
                <Form.Select
                  id="payment_terms"
                  isInvalid={!!errors.payment_terms}
                  {...register("payment_terms")}
                >
                  <option value="30">Net 30</option>
                  <option value="60">Net 60</option>
                  <option value="90">Net 90</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group>
            <Form.Label htmlFor="description">Project Description</Form.Label>
            <Form.Control
              id="description"
              isInvalid={!!errors.description}
              {...register("description")}
            />
            <Form.Control.Feedback type="invalid">
              {(errors as any)?.description?.message as string}
            </Form.Control.Feedback>
          </Form.Group>
        </Stack>
        <h5 className="text-muted mb-3">Item List</h5>
        {fields.map((item, index) => (
          <Stack key={item.id} gap={3} className="mb-4">
            <Form.Group>
              <Form.Label htmlFor="">Item Name</Form.Label>
              <Form.Control
                isInvalid={!!errors.items?.[index]?.name}
                {...register(`items.${index}.name`)}
              />
              <Form.Control.Feedback type="invalid">
                {(errors as any)?.items?.[index]?.name?.message as string}
              </Form.Control.Feedback>
            </Form.Group>
            <Row className="gx-3">
              <Col xs={{ span: 4 }}>
                <Form.Group>
                  <Form.Label htmlFor="">Qty.</Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    isInvalid={!!errors.items?.[index]?.quantity}
                    {...register(`items.${index}.quantity`)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {
                      (errors as any)?.items?.[index]?.quantity
                        ?.message as string
                    }
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={{ span: 4 }}>
                <Form.Group>
                  <Form.Label htmlFor="">Price</Form.Label>
                  <Form.Control
                    isInvalid={!!errors.items?.[index]?.price}
                    {...register(`items.${index}.price`)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {(errors as any)?.items?.[index]?.price?.message as string}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={{ span: 3 }}>
                <Form.Group>
                  <Form.Label htmlFor="">Total</Form.Label>
                  <span className="mt-2 border border-transparent d-block lh-1">
                    {items![index].quantity &&
                      items![index].price &&
                      formatCurrency(
                        items![index].quantity * items![index].price
                      )}
                  </span>
                </Form.Group>
              </Col>
              <Col xs={{ span: 1 }} className="pt-2 justify-content-end d-flex">
                <OverlayTrigger
                  delay={TOOLTIP_DELAY}
                  overlay={<Tooltip id="delete-tooltip">Delete Item</Tooltip>}
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
              </Col>
            </Row>
          </Stack>
        ))}
        <Button
          variant="secondary"
          className="w-100"
          onClick={() => append({ name: "", quantity: 0, price: 0 })}
        >
          <Icon name="plus-xl" className="me-2"></Icon>Add New Item
        </Button>
      </form>
    </Modal.Body>
    <Modal.Footer className="px-4 py-3 justify-content-between">
      <Button variant="light" onClick={close} className="ms-0 my-0 me-2">
        Cancel
      </Button>
      <Stack direction="horizontal" gap={2} className="m-0">
        <Button
          variant="dark"
          form="invoice-form"
          onClick={() => onSubmit("draft")}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving" : "Save as Draft"}
        </Button>
        <Button
          variant="primary"
          form="invoice-form"
          onClick={() => onSubmit("pending")}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending" : "Save & Send"}
        </Button>
      </Stack>
    </Modal.Footer>
  </Modal>
);

export default InvoicesModalForm;
