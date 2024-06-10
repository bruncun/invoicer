import { Tables } from "~/types/supabase";
import { Button, Card } from "react-bootstrap";
import { useNavigation } from "@refinedev/core";
import { Link } from "@remix-run/react";
import FormattedId from "~/components/formatted-id";
import Icon from "~/components/icon";
import { StatusBadge } from "~/components/status-badge";
import { formatCurrency, formatDisplayDate } from "~/utility/formatters";

const InvoicesListItem = ({
  invoice,
}: {
  invoice: Tables<"invoices"> & { items: Array<Tables<"items">> };
}) => {
  const formattedTotal = formatCurrency(
    invoice.items.reduce((acc, item) => acc + item.quantity * item.price, 0)
  );
  const formattedDate = formatDisplayDate(invoice.payment_due);
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
        <span className="flex-grow-1 text-muted">{invoice.client_name}</span>
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
            #<span className="text-body-emphasis">{invoice.id}</span>
          </Card.Title>
          {invoice.client_name}
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span className="d-block mb-2">Due {formattedDate}</span>
            <Card.Title className="fs-6">
              <span className="text-body-emphasis">{formattedTotal}</span>
            </Card.Title>
          </div>
          <div>{invoice.status && <StatusBadge status={invoice.status} />}</div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default InvoicesListItem;
