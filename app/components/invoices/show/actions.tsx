import { Stack, Button } from "react-bootstrap";
import { Link } from "@remix-run/react";
import Skeleton from "~/components/skeleton";
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

  return (
    <div className="d-flex justify-content-end w-100">
      <Stack direction="horizontal" gap={2} className={className}>
        {!invoice ? (
          <>
            <Skeleton
              className="w-5 rounded-pill"
              style={{ height: "2.375rem" }}
            />
            <Skeleton
              className="w-6 rounded-pill"
              style={{ height: "2.375rem" }}
            />
            <Skeleton
              className="w-8 rounded-pill"
              style={{ height: "2.375rem" }}
            />
          </>
        ) : (
          <>
            {invoice && invoice.id && invoice.status === "draft" && (
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
            {invoice?.status === "pending" && (
              <Button
                variant="primary"
                onClick={() => onUpdateStatus("paid")}
                disabled={isUpdateLoading}
              >
                {isUpdateLoading ? "Marking..." : "Mark as Paid"}
              </Button>
            )}
            {invoice?.status === "draft" && (
              <Button
                variant="primary"
                onClick={() => onUpdateStatus("pending")}
                disabled={isUpdateLoading}
              >
                {isUpdateLoading ? "Sending..." : "Send Invoice"}
              </Button>
            )}
          </>
        )}
      </Stack>
    </div>
  );
};

export default InvoiceActions;
