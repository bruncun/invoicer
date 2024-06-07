import { Button } from "react-bootstrap";
import Icon from "~/components/icon";
import { Tables } from "~/types/supabase";

export const InvoicesPager = ({
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

export default InvoicesPager;
