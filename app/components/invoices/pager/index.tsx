import { Button } from "react-bootstrap";
import Icon from "~/components/icon";
import { Tables } from "~/types/supabase";

export const InvoicesPager = ({
  invoices,
  pageSize,
  total,
  current,
  setCurrent,
}: {
  invoices: Array<Tables<"invoices">>;
  pageSize: number;
  total: number;
  current: number;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
}) => {
  // Calculate whether a next page is available
  const isNextPageAvailable = total >= pageSize * current + 1;
  const formattedTotal = new Intl.NumberFormat("en-US").format(total);

  return (
    <div className="d-flex justify-content-between align-items-center mt-2 ">
      <span className="text-muted fs-6 d-none d-lg-inline-block">
        Showing{" "}
        <span className="fw-medium">{(current - 1) * pageSize + 1}</span> to{" "}
        <span className="fw-medium">{current * pageSize}</span> of{" "}
        <span className="fw-medium">{formattedTotal}</span> invoices
      </span>
      <div className="d-flex justify-content-between w-100 d-lg-inline-block w-lg-auto">
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
