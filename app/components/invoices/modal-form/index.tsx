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
} from "react-hook-form";
import Icon from "~/components/icon";
import { InvoiceDto, Item, Status } from "~/types/invoices";
import { formatCurrency } from "~/utility/formatters";

type InvoicesModalFormProps = {
  close: () => void;
  visible: boolean;
  handleSubmit: UseFormHandleSubmit<InvoiceDto, undefined>;
  onSubmit: (status: Status) => void;
  onFinishHandler: (formData: InvoiceDto) => Promise<void>;
  fields: FieldArrayWithId<InvoiceDto, "items", "id">[];
  append: UseFieldArrayAppend<InvoiceDto, "items">;
  isSubmitting: boolean;
  remove: UseFieldArrayRemove;
  register: UseFormRegister<InvoiceDto>;
  items: Item[];
  title: string;
  errors: FieldErrors<InvoiceDto>;
};

const InvoicesModalForm = ({
  close,
  visible,
  handleSubmit,
  onSubmit,
  onFinishHandler,
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
    fullscreen="sm-down"
    onHide={close}
    className="slide-over-modal z-2"
    dialogClassName="mt-0 ms-lg-6 ps-lg-2 mb-0 min-vh-100"
    contentClassName="rounded-start-0"
    scrollable
  >
    <Modal.Header className="px-4 my-2">
      <Modal.Title className="lh-1 border-top border-transparent">
        {title}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body className="p-4">
      <form id="invoice-form" onSubmit={handleSubmit(onFinishHandler)}>
        <h6 className="text-primary mb-2">Bill From</h6>
        <Stack gap={3} className="mb-4">
          <Form.Group>
            <Form.Label htmlFor="senderStreet">Street Address</Form.Label>
            <Form.Control
              autoComplete="address"
              autoFocus={true}
              isInvalid={!!errors.senderStreet}
              id="senderStreet"
              {...register("senderStreet", {
                required: "This field is required",
              })}
            />
            <Form.Control.Feedback type="invalid">
              {(errors as any)?.senderStreet?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Row className="gx-3">
            <Col>
              <Form.Group>
                <Form.Label htmlFor="senderCity">City</Form.Label>
                <Form.Control
                  autoComplete="address-level2"
                  isInvalid={!!errors.senderCity}
                  id="senderCity"
                  {...register("senderCity", {
                    required: "This field is required",
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {(errors as any)?.senderStreet?.message as string}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label htmlFor="senderPostcode">Post Code</Form.Label>
                <Form.Control
                  type="tel"
                  autoComplete="postal-code"
                  isInvalid={!!errors.senderPostCode}
                  id="senderPostcode"
                  {...register("senderPostCode", {
                    required: "This field is required",
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {(errors as any)?.senderPostCode?.message as string}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label htmlFor="senderCountry">Country</Form.Label>
                <Form.Control
                  autoComplete="country"
                  isInvalid={!!errors.senderCountry}
                  id="senderCountry"
                  {...register("senderCountry", {
                    required: "This field is required",
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {(errors as any)?.senderCountry?.message as string}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Stack>
        <h6 className="text-primary mb-2">Bill To</h6>
        <Stack gap={3} className="mb-5">
          <Form.Group>
            <Form.Label htmlFor="clientName">Client's Name</Form.Label>
            <Form.Control
              {...register("clientName", {
                required: "This field is required",
              })}
              id="clientName"
              isInvalid={!!errors.clientName}
            />
            <Form.Control.Feedback type="invalid">
              {(errors as any)?.clientName?.message as string}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="clientEmail">Client's Email</Form.Label>
            <Form.Control
              {...register("clientEmail", {
                required: "This field is required",
              })}
              id="clientEmail"
              isInvalid={!!errors.clientEmail}
            />
            <Form.Control.Feedback type="invalid">
              {(errors as any)?.clientEmail?.message as string}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="clientStreet">Street Address</Form.Label>
            <Form.Control
              {...register("clientStreet", {
                required: "This field is required",
              })}
              id="clientStreet"
              isInvalid={!!errors.clientStreet}
            />
            <Form.Control.Feedback type="invalid">
              {(errors as any)?.clientStreet?.message as string}
            </Form.Control.Feedback>
          </Form.Group>
          <Row className="gx-3">
            <Col>
              <Form.Group>
                <Form.Label htmlFor="clientCity">City</Form.Label>
                <Form.Control
                  {...register("clientCity", {
                    required: "This field is required",
                  })}
                  id="clientCity"
                  isInvalid={!!errors.clientCity}
                />
                <Form.Control.Feedback type="invalid">
                  {(errors as any)?.clientCity?.message as string}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label htmlFor="clientPostCode">Post Code</Form.Label>
                <Form.Control
                  type="tel"
                  id="clientPostCode"
                  isInvalid={!!errors.clientPostCode}
                  {...register("clientPostCode", {
                    required: "This field is required",
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {(errors as any)?.clientPostCode?.message as string}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label htmlFor="clientCountry">Country</Form.Label>
                <Form.Control
                  id="clientCountry"
                  isInvalid={!!errors.clientCountry}
                  {...register("clientCountry", {
                    required: "This field is required",
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {(errors as any)?.clientCountry?.message as string}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row className="gx-3">
            <Col>
              <Form.Group>
                <Form.Label htmlFor="paymentDue">Invoice Date</Form.Label>
                <Form.Control
                  id="paymentDue"
                  isInvalid={!!errors.paymentDue}
                  {...register("paymentDue", {
                    required: "This field is required",
                  })}
                  type="date"
                />
                <Form.Control.Feedback type="invalid">
                  {(errors as any)?.paymentDue?.message as string}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label htmlFor="paymentTerms">Payment Terms</Form.Label>
                <Form.Select
                  id="paymentTerms"
                  isInvalid={!!errors.paymentTerms}
                  {...register("paymentTerms", {
                    required: "This field is required",
                  })}
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
              {...register("description", {
                required: "This field is required",
              })}
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
                {...register(`items.${index}.name`, {
                  required: "This field is required",
                })}
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
                    {...register(`items.${index}.quantity`, {
                      required: "This field is required",
                    })}
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
                    {...register(`items.${index}.price`, {
                      required: "This field is required",
                    })}
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
          <Icon name="plus-lg" className="me-2"></Icon>Add New Item
        </Button>
      </form>
    </Modal.Body>
    <Modal.Footer className="px-4 py-3">
      <Stack direction="horizontal" gap={2} className="m-0">
        <Button variant="link" onClick={close}>
          Cancel
        </Button>
        <Button
          variant="dark"
          form="invoice-form"
          type="submit"
          onSubmit={() => onSubmit("draft")}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving" : "Save as Draft"}
        </Button>
        <Button
          variant="primary"
          form="invoice-form"
          type="submit"
          onSubmit={() => onSubmit("pending")}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending" : "Save & Send"}
        </Button>
      </Stack>
    </Modal.Footer>
  </Modal>
);

export default InvoicesModalForm;
