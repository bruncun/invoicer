import { Tables } from "~/types/supabase";
import { Button, Card, Col, Row } from "react-bootstrap";
import emptyStateIllustration from "~/assets/illustration-empty-state.svg";
import { useNavigation } from "@refinedev/core";
import { Link } from "@remix-run/react";
import { FormattedId } from "~/components/formatted-id";
import { Icon } from "~/components/icon";
import { StatusBadge } from "~/components/status-badge";
import { formatCurrency, formatDisplayDate } from "~/utility/formatters";

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

export const InvoicesEmptyState = () => (
  <div
    className="d-flex align-items-center justify-content-center flex-grow-1 mt-7 mt-lg-9"
    data-testid="empty-state"
  >
    <Row className="w-100">
      <Col
        xs={{ span: 10, offset: 1 }}
        lg={{ span: 5 }}
        className="text-center mx-lg-auto"
      >
        <img
          src={emptyStateIllustration}
          alt="An illustration of two empty clipboards"
          className="img-fluid mb-5"
        ></img>
        <h2 className="fs-5 mb-3">No invoices</h2>
        <p className="text-muted mb-7">Create a new invoice to get started.</p>
      </Col>
    </Row>
  </div>
);

export const InvoicesItem = ({
  invoice,
  client,
}: {
  invoice: Tables<"invoices">;
  client: Tables<"clients">;
}) => {
  const formattedTotal = formatCurrency(invoice.total);
  const formattedDate = formatDisplayDate(invoice.paymentDue);
  const { showUrl } = useNavigation();

  return (
    <Card
      as={Link}
      to={showUrl("invoices", invoice.id)}
      className="border border-transparent border-primary-hover cursor-pointer shadow-sm"
    >
      <Card.Body className="d-lg-flex justify-content-between align-items-center px-lg-4 py-2 d-none">
        <div className="me-3 ms-3 w-7">
          <FormattedId id={invoice.id}></FormattedId>
        </div>
        <span className="me-5 pe-4 w-10 text-muted">Due {formattedDate}</span>
        <span className="flex-grow-1 text-muted">{client?.name ?? ""}</span>
        <span className="flex-grow-1 justify-content-end d-flex fw-semibold text-body-emphasis">
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
