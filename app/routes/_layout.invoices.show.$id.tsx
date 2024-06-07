import {
  HttpError,
  useBack,
  useCreate,
  useDelete,
  useDeleteMany,
  useNavigation,
  useNotification,
  useOne,
  useResource,
  useShow,
  useUpdate,
  useUpdateMany,
} from "@refinedev/core";
import { useModalForm } from "@refinedev/react-hook-form";
import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  Navbar,
  OverlayTrigger,
  Row,
  Spinner,
  Stack,
  Table,
  Tooltip,
} from "react-bootstrap";
import { FormattedId } from "~/components/formatted-id";
import { Icon } from "~/components/icon";
import { StatusBadge } from "~/components/status-badge";
import { Tables } from "~/types/supabase";
import { formatDisplayDate, formatCurrency } from "~/utility/formatters";
import { InvoiceType } from "./_layout.invoices._index";
import { formatDate } from "date-fns";
import { useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import FullScreenSpinner from "~/components/full-screen-spinner";

export const InvoicesShow = () => {
  const { edit, list } = useNavigation();
  const goBack = useBack();
  const { queryResult } = useShow({
    meta: {
      select:
        "*, client:clientId(*), senderAddress:senderAddressId(*), clientAddress:clientAddressId(*), items(*)",
    },
  });
  const { data: invoiceData, isLoading: isInvoicesLoading } = queryResult;

  const {
    control,
    reset,
    setValue,
    modal: { visible, close, show: modalShow },
    refineCore: { onFinish, formLoading },
    handleSubmit,
    formState: { errors },
    watch,
    register,
    saveButtonProps,
  } = useModalForm<InvoiceType, HttpError, InvoiceType>({
    refineCoreProps: { autoSave: { enabled: true } },
    syncWithLocation: true,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const data = invoiceData?.data;

  useEffect(() => {
    if (!isInvoicesLoading && data) {
      reset({
        senderStreet: data.senderAddress.street,
        senderCity: data.senderAddress.city,
        senderPostCode: data.senderAddress.postCode,
        senderCountry: data.senderAddress.country,
        clientName: data.client.name,
        clientEmail: data.client.email,
        clientStreet: data.clientAddress.street,
        clientCity: data.clientAddress.city,
        clientPostCode: data.clientAddress.postCode,
        clientCountry: data.clientAddress.country,
        paymentDue: formatDate(new Date(), "yyyy-MM-dd"),
        paymentTerms: "30",
        description: data.description,
        items: data.items,
      });
    }
  }, [data]);

  const { mutateAsync: mutateDeleteAsync } = useDelete();
  const { mutateAsync: mutateDeleteManyAsync } = useDeleteMany();
  const { mutateAsync: mutateCreateAsync } = useCreate();
  const { mutateAsync: mutateUpdateAsync } = useUpdate();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const { open } = useNotification();

  const onUpdateStatus = (status: "paid" | "pending") => {
    mutateUpdateAsync(
      {
        resource: "invoices",
        id: invoice?.id,
        values: {
          status,
        },
      },
      {
        onError: (error, variables, context) => {
          return error;
        },
        onSuccess: (data, variables, context) => {
          if (open)
            open({
              type: "success",
              message: `Invoice marked as ${status}`,
            });
        },
      }
    );
  };

  const onDeleteHandler = async () => {
    try {
      await Promise.all([
        await mutateDeleteManyAsync({
          resource: "items",
          ids: invoice?.items.map((item) => item.id),
        }),
        await mutateDeleteAsync(
          {
            resource: "invoices",
            id: invoice?.id,
          },
          {
            onError: (error, variables, context) => {
              return error;
            },
            onSuccess: (data, variables, context) => {
              if (open)
                open({
                  type: "success",
                  message: "Invoice deleted successfully",
                });
            },
          }
        ),
        await mutateDeleteAsync({
          resource: "addresses",
          id: invoice?.clientAddressId,
        }),
        await mutateDeleteAsync({
          resource: "addresses",
          id: invoice?.senderAddressId,
        }),
      ]);
      list("invoices");
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const onFinishHandler = async (formData: InvoiceType) => {
    setIsSubmitting(true);
    const newItems = formData.items.filter((item) => !item.id);
    const deletedItems = invoice?.items.filter((item) => {
      return !formData.items.some((newItem) => newItem.id === item.id);
    });
    const updatedItems = formData.items.filter((item) => item.id) as Array<
      Tables<"items">
    >;

    try {
      const responseData = await Promise.all([
        mutateUpdateAsync(
          {
            resource: "clients",
            id: invoice?.clientId,
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
        mutateUpdateAsync(
          {
            resource: "addresses",
            id: invoice?.senderAddressId,
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
        mutateUpdateAsync(
          {
            resource: "addresses",
            id: invoice?.clientAddressId,
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
        status: "draft",
        total: items!.reduce(
          (acc: number, item) => acc + item.quantity * item.price,
          0
        ),
      };
      await mutateUpdateAsync(
        {
          resource: "invoices",
          id: invoice?.id,
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

      await Promise.all([
        ...updatedItems.map((item) =>
          mutateUpdateAsync(
            {
              resource: "items",
              id: item.id,
              values: {
                invoiceId: invoice?.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                total: item.quantity * item.price,
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
          )
        ),
        ...newItems.map((item) =>
          mutateCreateAsync(
            {
              resource: "items",
              values: {
                invoiceId: invoice?.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                total: item.quantity * item.price,
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
          )
        ),
        ...deletedItems.map((item) =>
          mutateDeleteAsync(
            {
              resource: "items",
              id: item.id,
            },
            {
              onError: (error, variables, context) => {
                return error;
              },
              onSuccess: (data, variables, context) => {
                return data.data;
              },
            }
          )
        ),
      ]);

      close();
      reset();
      setIsSubmitting(false);
    } catch (error) {
      console.error("One of the mutations failed", error);
    }
  };

  if (isInvoicesLoading) return <FullScreenSpinner />;

  const invoice = invoiceData?.data as Tables<"invoices"> & {
    clientAddress: Tables<"addresses">;
    senderAddress: Tables<"addresses">;
    client: Tables<"clients">;
    items: Array<Tables<"items">>;
  };

  return (
    <>
      <div className="mb-3 d-none d-lg-block">
        <Button variant="link" onClick={goBack}>
          <Icon name="chevron-left" className="text-primary me-2"></Icon>
          Go back
        </Button>
      </div>
      <Card className="mb-2">
        <Card.Body className="px-lg-5 py-3">
          <dl className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center justify-content-between w-100 justify-content-lg-start w-lg-auto">
              <dt className="me-3 mb-0">Status</dt>
              <dd>
                {invoice?.status && (
                  <StatusBadge status={invoice?.status}></StatusBadge>
                )}
              </dd>
            </div>
            <Stack direction="horizontal" gap={2} className="d-none d-lg-flex">
              <Button
                variant="secondary"
                onClick={() => modalShow(invoice?.id)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => setShowConfirmationModal(!showConfirmationModal)}
              >
                Delete
              </Button>
              {invoice?.status === "pending" && (
                <Button
                  variant="primary"
                  onClick={() => onUpdateStatus("paid")}
                >
                  Mark
                  <span className="d-none d-lg-inline-block">
                    &nbsp;as Paid
                  </span>
                </Button>
              )}
              {invoice?.status === "draft" && (
                <Button
                  variant="primary"
                  onClick={() => onUpdateStatus("pending")}
                >
                  Send
                  <span className="d-none d-lg-inline-block">
                    &nbsp;Invoice
                  </span>
                </Button>
              )}
            </Stack>
          </dl>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body className="p-lg-5">
          <div className="d-lg-flex justify-content-between">
            <div>
              <FormattedId id={invoice?.id}></FormattedId>
              <div className="clearfix"></div>
              <p>{invoice?.description}</p>
            </div>
            <div className="text-lg-end">
              <span className="d-block">{invoice?.senderAddress.street}</span>
              <span className="d-block">{invoice?.senderAddress.city}</span>
              <span className="d-block">{invoice?.senderAddress.postCode}</span>
              <span className="d-block mb-3">
                {invoice?.senderAddress.country}
              </span>
            </div>
          </div>
          <dl className="mb-5">
            <Row>
              <Col xs={{ span: 6 }} lg={{ span: 4 }}>
                <dt>Invoice Date</dt>
                <dd className="mb-4 text-body-emphasis fw-semibold">
                  {invoice && formatDisplayDate(invoice?.created_at)}
                </dd>
                <dt>Payment Due</dt>
                <dd className="text-body-emphasis fw-semibold">
                  {invoice && formatDisplayDate(invoice?.paymentDue)}
                </dd>
              </Col>
              <Col xs={{ span: 6 }} lg={{ span: 4 }}>
                <dt>Bill To</dt>
                <dd>
                  <span className="text-body-emphasis fw-semibold">
                    {invoice?.client.name}
                  </span>
                  <span className="d-block">
                    {invoice?.clientAddress.street}
                  </span>
                  <span className="d-block">{invoice?.clientAddress.city}</span>
                  <span className="d-block">
                    {invoice?.clientAddress.postCode}
                  </span>
                  <span className="d-block">
                    {invoice?.clientAddress.country}
                  </span>
                </dd>
              </Col>
              <Col>
                <dt>Sent To</dt>
                <dd>
                  <span className="fw-semibold text-body-emphasis">
                    {invoice?.client.email}
                  </span>
                </dd>
              </Col>
            </Row>
          </dl>
          <Card bg="body-secondary" className="rounded-bottom-0">
            <Card.Body>
              <Table className="d-none d-lg-table text-body-tertiary">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th className="text-center">QTY.</th>
                    <th className="text-end">Price</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody className="fw-semibold">
                  {invoice?.items.map((item, index) => (
                    <tr key={index}>
                      <td className="text-body-emphasis fw-semibold">
                        {item.name}
                      </td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-end">{formatCurrency(item.price)}</td>
                      <td className="text-body-emphasis fw-semibold text-end">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Stack direction="vertical" gap={3} className="d-lg-none">
                {invoice?.items.map((item, index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <span className="fw-semibold text-body-emphasis d-block">
                        {item.name}
                      </span>
                      <span>
                        {item.quantity} x {formatCurrency(item.price)}
                      </span>
                    </div>
                    <span>{formatCurrency(item.total)}</span>
                  </div>
                ))}
              </Stack>
            </Card.Body>
          </Card>
          <Card
            bg="secondary"
            className="rounded-top-0 mb-6 mb-lg-0 text-white"
          >
            <Card.Body>
              <dl className="d-flex justify-content-between align-items-center">
                <dt>Amount Due</dt>
                <dd className="fw-semibold fs-4">
                  {formatCurrency(invoice?.total)}
                </dd>
              </dl>
            </Card.Body>
          </Card>{" "}
        </Card.Body>
      </Card>
      <Navbar
        fixed="bottom"
        bg="body"
        className="shadow-lg justify-content-between px-4 py-3 d-lg-none rounded-top-5"
      >
        <Button variant="secondary">Back</Button>
        <Stack direction="horizontal" gap={2}>
          <Button variant="secondary">Edit</Button>
          <Button
            variant="danger"
            onClick={() => setShowConfirmationModal(!showConfirmationModal)}
          >
            Delete
          </Button>
          <Button variant="primary">
            Mark<span className="d-none d-lg-inline-block">&nbsp;as Paid</span>
          </Button>
        </Stack>
      </Navbar>
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
            Edit #{invoice?.id}
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
                      delay={{ show: 500, hide: 0 }}
                      overlay={
                        <Tooltip id="delete-tooltip" className="position-fixed">
                          Delete Item
                        </Tooltip>
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
            <Button variant="dark">Save as Draft</Button>
            <Button
              variant="primary"
              form="create-form"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending" : "Save & Send"}
            </Button>
          </Stack>
        </Modal.Footer>
      </Modal>
      <Modal show={showConfirmationModal} centered>
        <Modal.Header>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete invoice #{invoice?.id}?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="link"
            onClick={() => setShowConfirmationModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={onDeleteHandler}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default InvoicesShow;
