import { Stack, Button } from "react-bootstrap";
import { Link } from "@remix-run/react";
import type { InvoicesShow } from "~/hooks/invoices/use-show";

type InvoiceActionsProps = {
  editUrl: (id: number) => string;
  setShowConfirmationModal: (show: boolean) => void;
  onUpdateStatus: (status: "paid" | "pending") => void;
  showConfirmationModal: boolean;
  isUpdateLoading: boolean;
  className?: string;
  invoicesShow: InvoicesShow;
};

const InvoiceActions = ({
  editUrl,
  className,
  setShowConfirmationModal,
  onUpdateStatus,
  showConfirmationModal,
  isUpdateLoading,
  invoicesShow,
}: InvoiceActionsProps) => {
  const { invoice } = invoicesShow;

  if (!invoice) return null;

  return (
    <div className="d-flex justify-content-end w-100">
      <Stack direction="horizontal" gap={2} className={className}>
        {invoice.id && invoice.status === "draft" && (
          <Button
            as={Link}
            to={editUrl(invoice.id)}
            prefetch="intent"
            variant="secondary"
          >
            Edit
          </Button>
        )}
        <Button
          variant="danger"
          onClick={() => setShowConfirmationModal(!showConfirmationModal)}
        >
          Delete
        </Button>
        {invoice.status === "pending" && (
          <Button
            variant="primary"
            onClick={() => onUpdateStatus("paid")}
            disabled={isUpdateLoading}
          >
            {isUpdateLoading ? "Marking..." : "Mark as Paid"}
          </Button>
        )}
        {invoice.status === "draft" && (
          <Button
            variant="primary"
            onClick={() => onUpdateStatus("pending")}
            disabled={isUpdateLoading}
          >
            {isUpdateLoading ? "Sending..." : "Send Invoice"}
          </Button>
        )}
      </Stack>
    </div>
  );
};

export default InvoiceActions;
