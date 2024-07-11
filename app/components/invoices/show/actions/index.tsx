import { Stack, Button } from "react-bootstrap";
import Skeleton from "~/components/skeleton";

type InvoiceActionsProps = {
  invoice: any;
  modalShow: (id: number) => void;
  setShowConfirmationModal: (show: boolean) => void;
  onUpdateStatus: (status: "paid" | "pending") => void;
  showConfirmationModal: boolean;
  isUpdateLoading: boolean;
  className?: string;
};

const InvoiceActions = ({
  invoice,
  modalShow,
  className,
  setShowConfirmationModal,
  onUpdateStatus,
  showConfirmationModal,
  isUpdateLoading,
}: InvoiceActionsProps) => {
  return (
    <Stack direction="horizontal" gap={2} className={className}>
      {!invoice ? (
        <>
          <Skeleton
            className="w-6 rounded-pill"
            style={{ height: "2.625rem" }}
          />
          <Skeleton
            className="w-7 rounded-pill"
            style={{ height: "2.625rem" }}
          />
          <Skeleton
            className="w-8 rounded-pill"
            style={{ height: "2.625rem" }}
          />
        </>
      ) : (
        <>
          {invoice && invoice.id && invoice.status === "draft" && (
            <Button variant="secondary" onClick={() => modalShow(invoice.id)}>
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
  );
};

export default InvoiceActions;
