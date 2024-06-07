import {
  useNavigation,
  useMany,
  useList,
  HttpError,
  useCreate,
  useCreateMany,
  useNotification,
} from "@refinedev/core";
import {
  Stack,
  Form,
  Button,
  Col,
  Row,
  Spinner,
  Modal,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Icon } from "~/components/icon";
import { Tables } from "~/types/supabase";
import { formatDate } from "date-fns";
import { formatCurrency } from "~/utility/formatters";
import { useState } from "react";
import { useModalForm } from "@refinedev/react-hook-form";
import { useFieldArray } from "react-hook-form";
import { InvoicesPageHeader } from "~/components/invoices/page-header";
import { InvoicesList } from "~/components/invoices/list";
import FullScreenSpinner from "~/components/full-screen-spinner";

export const Pager = ({
  invoices,
  pageSize,
  current,
  setCurrent,
}: {
  invoices: Array<Tables<"invoices">>;
  pageSize: number;
  current: number;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <div className="d-flex justify-content-between align-items-center mt-2 ">
      <span className="text-muted fs-6 d-none d-lg-inline-block">
        Showing <span className="fw-medium">{current}</span> of{" "}
        <span className="fw-medium">{invoices.length}</span> invoices
      </span>
      <div className="d-flex justify-content-between w-100 d-lg-inline-block w-lg-auto">
        <Button
          variant="link"
          className="rounded-3"
          onClick={() => setCurrent((prev) => prev - 1)}
          disabled={current === 1}
        >
          <Icon name="arrow-left me-2"></Icon>
          Previous
        </Button>
        <Button
          variant="link"
          className="rounded-3"
          onClick={() => setCurrent((prev) => prev + 1)}
          disabled={invoices.length < pageSize}
        >
          Next
          <Icon name="arrow-right ms-2"></Icon>
        </Button>
      </div>
    </div>
  );
};

export type InvoiceType = {
  clientId: string;
  status: string;
  total: number;
  senderAddressId: string;
  clientAddressId: string;
  senderStreet?: string;
  senderCity?: string;
  senderPostCode?: string;
  senderCountry?: string;
  clientName: string;
  clientEmail: string;
  clientStreet?: string;
  clientCity?: string;
  clientPostCode?: string;
  clientCountry?: string;
  paymentDue: string;
  paymentTerms: string;
  description: string;
  items: { id?: number; name: string; quantity: number; price: number }[];
};

export const InvoiceList = () => {
  const { edit, show, create } = useNavigation();
  const [current, setCurrent] = useState(1);
  const [filters, setFilters] = useState<string[]>([]);
  const pageSize = 10;
  const { data: invoicesData, isLoading: isInvoicesLoading } = useList<
    Tables<"invoices">,
    HttpError
  >({
    filters: [
      {
        field: "status",
        operator: "in",
        value: filters.length > 0 ? filters : ["draft", "pending", "paid"],
      },
    ],
    pagination: {
      current,
      pageSize,
    },
  });
  let invoices = invoicesData?.data ?? [];

  const { data: clientsData, isLoading: isClientsLoading } = useMany<
    Tables<"clients">,
    HttpError
  >({
    resource: "clients",
    ids: invoicesData?.data?.map((item) => item?.clientId) ?? [],
    queryOptions: {
      enabled: !!invoicesData?.data,
    },
  });
  const clients = clientsData?.data ?? [];

  const { mutateAsync } = useCreate();
  const { mutateAsync: mutateManyAsync } = useCreateMany();

  const {
    control,
    reset,
    modal: { visible, close, show: modalShow },
    refineCore: { onFinish, formLoading },

    handleSubmit,
    formState: { errors },
    watch,
    register,
    setValue,
    saveButtonProps,
  } = useModalForm<InvoiceType, HttpError, InvoiceType>({
    refineCoreProps: { action: "create", autoSave: { enabled: true } },
    syncWithLocation: true,
    defaultValues: {
      senderStreet: "",
      senderCity: "",
      senderPostCode: "",
      senderCountry: "",
      clientName: "",
      clientEmail: "",
      clientStreet: "",
      clientCity: "",
      clientPostCode: "",
      clientCountry: "",
      paymentDue: formatDate(new Date(), "yyyy-MM-dd"),
      paymentTerms: "30",
      description: "",
      status: "pending",
      items: [{ name: "", quantity: 0, price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (status: string) => {
    setValue("status", status);
    handleSubmit(onFinishHandler);
  };

  const onFinishHandler = async (formData: InvoiceType) => {
    setIsSubmitting(true);
    try {
      const responseData = await Promise.all([
        mutateAsync(
          {
            resource: "clients",
            values: {
              name: formData.clientName,
              email: formData.clientEmail,
            },
          },
          {
            onError: (error, variables, context) => {
              return error;
            },
            onSuccess: (data, variables, context) => {
              return data.data;
            },
          }
        ),
        mutateAsync(
          {
            resource: "addresses",
            values: {
              street: formData.senderStreet,
              city: formData.senderCity,
              postCode: formData.senderPostCode,
              country: formData.senderCountry,
            },
          },
          {
            onError: (error, variables, context) => {
              return error;
            },
            onSuccess: (data, variables, context) => {
              return data.data;
            },
          }
        ),
        mutateAsync(
          {
            resource: "addresses",
            values: {
              street: formData.clientStreet,
              city: formData.clientCity,
              postCode: formData.clientPostCode,
              country: formData.clientCountry,
            },
          },
          {
            onError: (error, variables, context) => {
              return error;
            },
            onSuccess: (data, variables, context) => {
              return data.data;
            },
          }
        ),
      ]);

      const newInvoice = {
        clientId: responseData[0].data.id,
        senderAddressId: responseData[1].data.id,
        clientAddressId: responseData[2].data.id,
        paymentDue: formData.paymentDue,
        paymentTerms: parseInt(formData.paymentTerms),
        description: formData.description,
        status: formData.status,
        total: items!.reduce(
          (acc: number, item) => acc + item.quantity * item.price,
          0
        ),
      };
      const invoice = await mutateAsync(
        {
          resource: "invoices",
          values: newInvoice,
        },
        {
          onError: (error, variables, context) => {
            return error;
          },
          onSuccess: (data, variables, context) => {
            return data.data;
          },
        }
      );
      await mutateManyAsync(
        {
          resource: "items",
          values: items!.map((item) => ({
            invoiceId: invoice.data.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.quantity * item.price,
          })),
        },
        {
          onError: (error, variables, context) => {
            return error;
          },
          onSuccess: (data, variables, context) => {
            return data.data;
          },
        }
      ),
        close();
      reset();
      setIsSubmitting(false);
    } catch (error) {
      console.error("One of the mutations failed", error);
    }
  };

  if (isInvoicesLoading || isClientsLoading) return <FullScreenSpinner />;

  return (
    <>
      <InvoicesPageHeader
        filters={filters}
        setFilters={setFilters}
        modalShow={modalShow}
      ></InvoicesPageHeader>
      <InvoicesList invoices={invoices} clients={clients}></InvoicesList>
      {invoicesData && invoicesData?.total > 0 ? (
        <Pager
          invoices={invoices}
          pageSize={pageSize}
          current={current}
          setCurrent={setCurrent}
        ></Pager>
      ) : null}
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
            New Invoice
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <form id="create-form" onSubmit={handleSubmit(onFinishHandler)}>
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
                    <Form.Label htmlFor="paymentTerms">
                      Payment Terms
                    </Form.Label>
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
                <Form.Label htmlFor="description">
                  Project Description
                </Form.Label>
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
                        {
                          (errors as any)?.items?.[index]?.price
                            ?.message as string
                        }
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
                  <Col
                    xs={{ span: 1 }}
                    className="pt-2 justify-content-end d-flex"
                  >
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
              form="create-form"
              type="submit"
              onSubmit={() => onSubmit("draft")}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving" : "Save as Draft"}
            </Button>
            <Button
              variant="primary"
              form="create-form"
              type="submit"
              onSubmit={() => onSubmit("pending")}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending" : "Save & Send"}
            </Button>
          </Stack>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default InvoiceList;
