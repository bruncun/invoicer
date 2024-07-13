import { Button, Card } from "react-bootstrap";
import { useNavigation } from "@refinedev/core";
import { Link } from "@remix-run/react";
import FormattedId from "~/components/formatted-id";
import Icon from "~/components/icon";
import { StatusBadge } from "~/components/status-badge";
import { formatCurrency, formatDisplayDate } from "~/utility/formatters";
import { Invoice } from "~/types/invoices";
import Skeleton from "~/components/skeleton";

const InvoicesListItem = ({ invoice }: { invoice?: Invoice }) => {
  let formattedDate, formattedTotal;

  if (invoice) {
    formattedTotal = formatCurrency(
      invoice?.items.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
      ) ?? 0
    );
    formattedDate = formatDisplayDate(invoice?.payment_due ?? "");
  }

  const { showUrl } = useNavigation();

  return (
    <Card
      as={invoice ? Link : "div"}
      {...(invoice ? { to: showUrl("invoices", invoice.id) } : {})}
      className={`border border-transparent ${
        invoice ? "border-primary-hover cursor-pointer" : ""
      }`}
    >
      <Card.Body className="d-xl-flex justify-content-between align-items-center px-xl-4 py-xl-2 d-none border border-transparent">
        <div className="me-3 ms-3 w-7">
          <FormattedId id={invoice?.id}></FormattedId>
        </div>
        <span
          className={`me-5 pe-4 w-10 text-muted text-nowrap ${
            invoice ? "" : "fs-0"
          }`}
        >
          {invoice?.description ? `Due ${formattedDate}` : <Skeleton />}
        </span>
        <span
          className={`text-muted lh-1 text-truncate w-10 d-inline-block ${
            invoice ? "" : "fs-0"
          }`}
        >
          {invoice?.client_name ?? <Skeleton className="w-7" />}
        </span>
        <span
          className={`flex-grow-1 justify-content-end d-flex fw-medium text-body-emphasis ${
            invoice ? "" : "fs-0"
          }`}
        >
          {invoice?.items ? formattedTotal : <Skeleton className="w-6" />}
        </span>
        <div className="ms-5 me-3">
          <StatusBadge status={invoice?.status} />
        </div>
        <Button
          variant="link"
          className={`text-primary ${!invoice ? "opacity-0" : ""}`}
        >
          <Icon name="chevron-right"></Icon>
        </Button>
      </Card.Body>
      <Card.Body className="d-xl-none justify-content-between align-items-start">
        <div className="d-flex justify-content-between mb-2 d-xl-none lh-1">
          <Card.Title className="fs-6">
            <FormattedId id={invoice?.id}></FormattedId>
          </Card.Title>
          {(
            <span className="text-truncate d-inline-block w-10 text-end">
              {invoice?.client_name}
            </span>
          ) ?? <Skeleton className="w-7" />}
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span className="d-block mb-2">
              {invoice?.description ? `Due ${formattedDate}` : <Skeleton />}
            </span>
            <Card.Title className="fs-6 mb-0 text-body-emphasis lh-1">
              {invoice?.items ? formattedTotal : <Skeleton className="w-6" />}
            </Card.Title>
          </div>
          <div>
            <StatusBadge status={invoice?.status} />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default InvoicesListItem;
