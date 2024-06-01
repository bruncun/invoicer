import { useNavigation, useMany, useList, HttpError } from "@refinedev/core";
import {
  Stack,
  Dropdown,
  Form,
  Button,
  Card,
  Badge,
  Col,
  Row,
  Spinner,
} from "react-bootstrap";
import { Icon } from "~/components/icon";
import emptyStateIllustration from "~/assets/illustration-empty-state.svg";
import { Tables } from "~/types/supabase";
import { format } from "date-fns";
import { FormattedId } from "~/components/formatted-id";
import { StatusBadge } from "~/components/status-badge";
import { formatCurrency, formatDate } from "~/utility/formatters";
import { useState } from "react";

export const InvoicesList = ({
  invoices,
  clients,
}: {
  invoices: Array<Tables<"invoices">>;
  clients: Array<Tables<"clients">>;
}) => {
  return (
    <>
      {invoices.length > 0 ? (
        <ul data-testid="invoices-list" className="list-unstyled mt-4">
          {invoices.map((invoice, idx) => (
            <li
              key={invoice.id}
              className={idx !== invoices.length - 1 ? "mb-2" : ""}
            >
              <InvoicesItem
                invoice={invoice}
                client={
                  clients.find(
                    ({ id }) => invoice.clientId === id
                  ) as Tables<"clients">
                }
              ></InvoicesItem>
            </li>
          ))}
        </ul>
      ) : (
        <InvoicesEmptyState></InvoicesEmptyState>
      )}
    </>
  );
};

export const InvoicesItem = ({
  invoice,
  client,
}: {
  invoice: Tables<"invoices">;
  client: Tables<"clients">;
}) => {
  const formattedTotal = formatCurrency(invoice.total);
  const formattedDate = formatDate(invoice.paymentDue);

  return (
    <Card className="border border-transparent border-primary-hover cursor-pointer shadow-sm">
      <Card.Body className="d-lg-flex justify-content-between align-items-center px-lg-4 py-2 my-1 d-none">
        <div className="me-3 ms-3 w-7">
          <FormattedId id={invoice.id}></FormattedId>
        </div>
        <span className="me-5 pe-4 w-10 text-muted">Due {formattedDate}</span>
        <span className="flex-grow-1 text-muted">{client?.name ?? ""}</span>
        <span className="flex-grow-1 justify-content-end d-flex fw-semibold text-dark">
          {formattedTotal}
        </span>
        <div className="ms-5 me-3">
          {invoice.status && <StatusBadge status={invoice.status} />}
        </div>
        <Button variant="link">
          <Icon name="chevron-right"></Icon>
        </Button>
      </Card.Body>
      <Card.Body className="d-lg-none justify-content-between align-items-center">
        <div className="d-flex justify-content-between mb-3 d-lg-none">
          <Card.Title className="fs-6">
            #<span className="text-dark">{invoice.id}</span>
          </Card.Title>
          {client?.name ?? ""}
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span className="d-block mb-2">Due {formattedDate}</span>
            <Card.Title className="fs-6">
              $<span className="text-dark">{formattedTotal}</span>
            </Card.Title>
          </div>
          <div>{invoice.status && <StatusBadge status={invoice.status} />}</div>
        </div>
      </Card.Body>
    </Card>
  );
};

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

export const InvoicesEmptyState = () => (
  <div
    className="d-flex flex-grow-1 align-items-center justify-content-center h-100"
    data-testid="empty-state"
  >
    <Row>
      <Col xs={{ span: 6, offset: 3 }} className="text-center">
        <img
          src={emptyStateIllustration}
          alt="An illustration of two empty clipboards"
          className="img-fluid mb-5"
        ></img>
        <h2 className="fs-5 mb-3">No invoices</h2>
        <p className="text-muted">Create a new invoice to get started.</p>
      </Col>
    </Row>
  </div>
);

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

  if (isInvoicesLoading || isClientsLoading) {
    return (
      <div
        className="d-flex flex-grow-1 align-items-center justify-content-center h-100"
        data-testid="loading"
      >
        <Row className="w-100">
          <Col xs={{ span: 6, offset: 3 }} className="text-center">
            <Spinner variant="primary" className="mb-4"></Spinner>
            <h2 className="fs-5">Loading...</h2>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <>
      <InvoicesPageHeader
        count={invoices.length}
        filters={filters}
        setFilters={setFilters}
      ></InvoicesPageHeader>
      <InvoicesList invoices={invoices} clients={clients}></InvoicesList>
      <Pager
        invoices={invoices}
        pageSize={pageSize}
        current={current}
        setCurrent={setCurrent}
      ></Pager>
    </>
  );
};

export const InvoicesPageHeader = ({
  count,
  filters,
  setFilters,
}: {
  count?: number;
  filters: string[];
  setFilters: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const { create } = useNavigation();

  const handleStatusChange = (status: string, checked: boolean) => {
    if (checked) {
      setFilters([...filters, status]);
    } else {
      setFilters(filters.filter((filter) => filter !== status));
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center">
      <h1 className="fs-4 fs-lg-3 mb-0 lh-1">
        Invoices{" "}
        <span className="text-muted fw-normal fs-5 fs-lg-4" data-testid="count">
          ({count})
        </span>
      </h1>
      <Stack direction="horizontal" gap={2}>
        <Dropdown>
          <Dropdown.Toggle variant="link">
            Filter
            <span className="d-none d-lg-inline-block">&nbsp;by Status</span>
            <Icon name="chevron-down ms-2"></Icon>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Form className="px-3 py-2">
              {["draft", "pending", "paid"].map((status) => (
                <Form.Check
                  key={status}
                  label={status.charAt(0).toUpperCase() + status.slice(1)}
                  id={status}
                  value={status}
                  checked={filters.includes(status)}
                  onChange={({ target: { checked } }) =>
                    handleStatusChange(status, checked)
                  }
                ></Form.Check>
              ))}
            </Form>
          </Dropdown.Menu>
        </Dropdown>
        <Button variant="primary" onClick={() => create("invoices")}>
          <Icon name="plus-circle-fill" className="me-2 mt-1"></Icon>New
          <span className="d-none d-sm-inline-block">&nbsp;Invoice</span>
        </Button>
      </Stack>
    </div>
  );
};

export default InvoiceList;
