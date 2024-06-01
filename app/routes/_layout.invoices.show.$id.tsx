import {
  useBack,
  useNavigation,
  useOne,
  useResource,
  useShow,
} from "@refinedev/core";
import {
  Button,
  Card,
  Col,
  Navbar,
  Row,
  Spinner,
  Stack,
  Table,
} from "react-bootstrap";
import { FormattedId } from "~/components/formatted-id";
import { Icon } from "~/components/icon";
import { StatusBadge } from "~/components/status-badge";
import { Tables } from "~/types/supabase";
import { formatDate, formatCurrency } from "~/utility/formatters";

export const InvoicesShow = () => {
  const { edit, list } = useNavigation();
  const { id } = useResource();
  const goBack = useBack();
  const { queryResult } = useShow({
    meta: {
      select:
        "*, client:clientId(*), senderAddress:senderAddressId(*), clientAddress:clientAddressId(*), items(*)",
    },
  });

  const { data: invoiceData, isLoading: invoiceIsLoading } = queryResult;
  if (invoiceIsLoading) {
    return <Spinner></Spinner>;
  }

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
                {invoice.status && (
                  <StatusBadge status={invoice.status}></StatusBadge>
                )}
              </dd>
            </div>
            <Stack direction="horizontal" gap={2} className="d-none d-lg-flex">
              <Button variant="secondary">Edit</Button>
              <Button variant="danger">Delete</Button>
              {invoice.status === "pending" && (
                <Button variant="primary">
                  Mark
                  <span className="d-none d-lg-inline-block">
                    &nbsp;as Paid
                  </span>
                </Button>
              )}
              {invoice.status === "draft" && (
                <Button variant="primary">
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
              <FormattedId id={invoice.id?.toString() ?? ""}></FormattedId>
              <div className="clearfix"></div>
              <p>{invoice.description}</p>
            </div>
            <div>
              <span className="d-block">{invoice.senderAddress.street}</span>
              <span className="d-block">{invoice.senderAddress.city}</span>
              <span className="d-block">{invoice.senderAddress.postCode}</span>
              <span className="d-block mb-3">
                {invoice.senderAddress.country}
              </span>
            </div>
          </div>
          <dl className="mb-5">
            <Row>
              <Col xs={{ span: 6 }} lg={{ span: 4 }}>
                <dt>Invoice Date</dt>
                <dd className="mb-4 text-body-emphasis fw-semibold">
                  {invoice && formatDate(invoice.createdAt)}
                </dd>
                <dt>Payment Due</dt>
                <dd className="text-body-emphasis fw-semibold">
                  {invoice && formatDate(invoice.paymentDue)}
                </dd>
              </Col>
              <Col xs={{ span: 6 }} lg={{ span: 4 }}>
                <dt>Bill To</dt>
                <dd>
                  <span className="text-body-emphasis fw-semibold">
                    {invoice.client.name}
                  </span>
                  <span className="d-block">
                    {invoice.clientAddress.street}
                  </span>
                  <span className="d-block">{invoice.clientAddress.city}</span>
                  <span className="d-block">
                    {invoice.clientAddress.postCode}
                  </span>
                  <span className="d-block">
                    {invoice.clientAddress.country}
                  </span>
                </dd>
              </Col>
              <Col>
                <dt>Sent To</dt>
                <dd>
                  <span className="fw-semibold text-body-emphasis">
                    {invoice.client.email}
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
                  {invoice.items.map((item, index) => (
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
                {invoice.items.map((item, index) => (
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
                  {formatCurrency(invoice.total)}
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
          <Button variant="danger">Delete</Button>
          <Button variant="primary">
            Mark<span className="d-none d-lg-inline-block">&nbsp;as Paid</span>
          </Button>
        </Stack>
      </Navbar>
    </>
  );
};

export const Pager = ({
  invoices,
}: {
  invoices: Array<Tables<"invoices">>;
}) => (
  <div className="d-flex justify-content-between align-items-center mt-2 ">
    <span className="text-secondary fs-6 d-none d-lg-inline-block">
      Showing <span className="fw-medium">{invoices.length}</span> of{" "}
      <span className="fw-medium">{invoices.length}</span> invoices
    </span>
    <div className="d-flex justify-content-between w-100 d-lg-inline-block w-lg-auto">
      <Button variant="secondary" className="rounded-3">
        <Icon name="arrow-left me-2"></Icon>
        Previous
      </Button>
      <Button variant="secondary" className="rounded-3">
        Next
        <Icon name="arrow-right ms-2"></Icon>
      </Button>
    </div>
  </div>
);

export default InvoicesShow;
