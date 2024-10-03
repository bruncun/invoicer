import { Button } from "react-bootstrap";
import Icon from "~/components/icon";
import { InvoicesList } from "~/hooks/invoices/use-invoices-list";

type InvoicesPagerProps = {
  invoicesList: InvoicesList;
};

export const InvoicesPager = ({
  invoicesList: { pageSizeState, currentState, data },
}: InvoicesPagerProps) => {
  const [pageSize] = pageSizeState;
  const [current, setCurrent] = currentState;
  const total = data?.total ?? 0;
  const isNextPageAvailable = total >= pageSize * current + 1;
  const formattedTotal = new Intl.NumberFormat("en-US").format(total);

  if (total === 0) return null;

  return (
    <div className="d-flex justify-content-between align-items-center">
      <span className="text-muted fs-6 d-none d-xl-inline-block">
        Showing{" "}
        <span className="fw-medium">{(current - 1) * pageSize + 1}</span> to{" "}
        <span className="fw-medium">{current * pageSize}</span> of{" "}
        <span className="fw-medium">{formattedTotal}</span> invoices
      </span>
      <div className="d-flex justify-content-between w-100 d-xl-inline-block w-xl-auto">
        <Button
          variant="link"
          className="rounded-3"
          onClick={() => setCurrent((prev) => prev - 1)}
          disabled={current === 1}
        >
          <Icon name="arrow-left text-primary me-2"></Icon>
          Previous
        </Button>
        <Button
          variant="link"
          className="rounded-3"
          onClick={() => setCurrent((prev) => prev + 1)}
          disabled={!isNextPageAvailable}
        >
          Next
          <Icon name="arrow-right text-primary ms-2"></Icon>
        </Button>
      </div>
    </div>
  );
};

export default InvoicesPager;
