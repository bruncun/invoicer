import { HttpError } from "@refinedev/core";
import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import { IMaskInput } from "react-imask";
import {
  Modal,
  Button,
  Form,
  Stack,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
  Alert,
  InputGroup,
} from "react-bootstrap";
import { Controller, UseFieldArrayReturn } from "react-hook-form";
import { InferType } from "yup";
import Icon from "~/components/icon";
import { TOOLTIP_DELAY, invoiceSchema } from "~/constants";
import { Status } from "~/types/invoices";
import { formatCurrency } from "~/utility/formatters";
import DatePicker from "~/components/date-picker";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";

type InvoicesModalFormProps = {
  onSubmit: (status: Status) => void;
  invoicesCreateModalForm: UseModalFormReturnType<
    InferType<typeof invoiceSchema>,
    HttpError,
    InferType<typeof invoiceSchema>
  >;
  itemsFieldArray: UseFieldArrayReturn<
    InferType<typeof invoiceSchema>,
    "items",
    "id"
  >;
  onFinish: (formData: InferType<typeof invoiceSchema>) => Promise<void>;
};

const InvoicesModalForm = ({
  onSubmit,
  onFinish,
  itemsFieldArray,
  invoicesCreateModalForm,
}: InvoicesModalFormProps) => {
  const {
    modal: { visible, close, title },
    handleSubmit,
    watch,
    getValues,
    control,
    register,
    formState: { errors, isSubmitting },
  } = invoicesCreateModalForm;
  const items = watch("items");
  const { fields, append, remove } = itemsFieldArray;
  const paymentTerms = {
    30: "Net 30",
    60: "Net 60",
    90: "Net 90",
  };

  return (
    <Modal
      size="lg"
      show={visible}
      fullscreen="md-down"
      onHide={close}
      enforceFocus={false}
      className="z-2"
      dialogClassName="ms-sm-0 mt-0 mb-0 min-vh-lg-100"
      contentClassName="rounded-start-0 ps-xl-6"
      scrollable
    >
      <Modal.Header className="px-4 py-3">
        <Modal.Title className="lh-1 border-top border-transparent py-1">
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <form id="invoice-form" onSubmit={handleSubmit(onFinish)}>
          <input type="hidden" {...register("user_id")} />
          <h6 className="text-primary mb-2">Bill From</h6>
          <Stack gap={3} className="mb-5">
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
          </Stack>
          <Stack gap={3} className="mb-4">
            <Row className="gx-3">
              <Col>
                <Form.Group>
                  <Controller
                    name="payment_due"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        label="Invoice Date"
                        onChange={onChange}
                        selected={value}
                      />
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {(errors as any)?.payment_due?.message as string}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label htmlFor="payment_terms">Payment Terms</Form.Label>
                  <Controller
                    name="payment_terms"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Listbox value={value} onChange={onChange}>
                        <ListboxButton className="form-select text-start w-100">
                          {
                            paymentTerms[
                              value as unknown as keyof typeof paymentTerms
                            ]
                          }
                        </ListboxButton>
                        <ListboxOptions
                          className="dropdown-menu show d-grid gap-1 p-2 rounded-3 text-body-emphasis border outline-0 listbox-options"
                          style={{ width: "var(--button-width)" }}
                        >
                          {Object.entries(paymentTerms).map((paymentTerm) => (
                            <ListboxOption
                              key={paymentTerm[0]}
                              value={paymentTerm[0]}
                              as={Fragment}
                            >
                              {({ focus, selected }) => (
                                <div
                                  className={`dropdown-item rounded-2 px-2 ${
                                    selected ? "bg-primary text-white" : ""
                                  } 
                                  ${
                                    focus && !selected
                                      ? "bg-body-tertiary text-body-emphasis"
                                      : ""
                                  }`}
                                >
                                  <Icon
                                    name="check-lg"
                                    className={`text-primary me-2 ${
                                      selected ? "text-white" : "opacity-0"
                                    }`}
                                  />
                                  {paymentTerm[1]}
                                </div>
                              )}
                            </ListboxOption>
                          ))}
                        </ListboxOptions>
                      </Listbox>
                    )}
                  />
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
          <h5 className="text-muted mb-3 lh-lg">Item List</h5>
          {errors.items?.root && (
            <Alert variant="danger">
              {(errors as any)?.items?.root?.message as string}
            </Alert>
          )}
          {fields.map((item, index) => (
            <Stack key={item.id} gap={3} className="mb-4">
              <Row className="gx-3">
                <Col xs={{ span: 12 }} xl={{ span: 4 }}>
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
                </Col>
                <Col xs={{ span: 4 }} xl={{ span: 2 }}>
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
                <Col xs={{ span: 4 }} xl={{ span: 3 }}>
                  <Form.Group>
                    <CurrencyInput
                      name={`items.${index}.price`}
                      control={control}
                      label="Price"
                      // isInvalid={!!errors.items?.[index]?.price}
                      // {...register(`items.${index}.price`)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {
                        (errors as any)?.items?.[index]?.price
                          ?.message as string
                      }
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col xs={{ span: 3 }} xl={{ span: 2 }}>
                  <Form.Group>
                    <Form.Label>Total</Form.Label>
                    <span className="mt-2 pt-1 border border-transparent d-block lh-1 fw-semibold text-body-emphasis text-truncate">
                      {items[index].quantity &&
                        items[index].price &&
                        formatCurrency(
                          items[index].quantity * items[index].price
                        )}
                    </span>
                  </Form.Group>
                </Col>
                <Col
                  xs={{ span: 1 }}
                  xl={{ span: 1 }}
                  className="pt-2 justify-content-end d-flex"
                >
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
        </form>
      </Modal.Body>
      <Modal.Footer className="px-4 py-3 justify-content-between">
        <Button variant="link" onClick={close} className="ms-0 my-0 me-2">
          Cancel
        </Button>
        <Stack direction="horizontal" gap={2} className="m-0">
          <Button
            variant="secondary"
            form="invoice-form"
            onClick={() => onSubmit("draft")}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Saving"
            ) : (
              <>
                Save
                <span className="d-none d-xl-inline-block">&nbsp;as Draft</span>
              </>
            )}
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
};

export default InvoicesModalForm;
interface CurrencyInputProps {
  name: string;
  control: any;
  label: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  name,
  control,
  label,
}) => {
  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <Controller
        name={name}
        control={control}
        render={({
          field: { onChange, value, ref },
          fieldState: { error },
        }) => (
          <>
            <InputGroup>
              <InputGroup.Text>
                <Icon name="currency-dollar" />
              </InputGroup.Text>
              <IMaskInput
                name={name}
                mask={Number}
                thousandsSeparator={","}
                radix={"."}
                mapToRadix={["."]}
                value={value.toString()}
                autofix={true}
                unmask={true}
                onAccept={(value: string) => {
                  return onChange(value ? parseFloat(value) : "");
                }}
                onBlur={(e) => {
                  const value = e.target.value;
                  if (value === "$" || !value) onChange(0);
                }}
                inputRef={ref}
                className={`form-control border-start-0 ${
                  error ? "is-invalid" : ""
                }`}
              />
            </InputGroup>
            <Form.Control.Feedback type="invalid">
              {error?.message}
            </Form.Control.Feedback>
          </>
        )}
      />
    </Form.Group>
  );
};
