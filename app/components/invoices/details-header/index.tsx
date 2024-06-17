import { Button, Card, Stack } from "react-bootstrap";
import { StatusBadge } from "~/components/status-badge";
import useInvoicesShow from "~/hooks/invoices/use-show";
import { InvoiceWithRelated, Status } from "~/types/invoices";

type InvoicesDetailsHeaderProps = {
  modalShow: (id: number) => void;
  setShowConfirmationModal: (show: boolean) => void;
  onUpdateStatus: (status: "paid" | "pending") => void;
  showConfirmationModal: boolean;
};

export const InvoicesDetailsHeader = ({
  modalShow,
  setShowConfirmationModal,
  onUpdateStatus,
  showConfirmationModal,
}: InvoicesDetailsHeaderProps) => {
  const { invoice, isLoading: isInvoicesLoading, isError } = useInvoicesShow();

  return (
    <Card className="mb-2">
      <Card.Body className="px-sm-5 py-3">
        <dl className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center justify-content-between w-100 justify-content-sm-start w-sm-auto">
            <dt className="me-3 mb-0">Status</dt>
            <dd>
              <StatusBadge
                status={invoice?.status}
                isLoading={isInvoicesLoading}
              ></StatusBadge>
            </dd>
          </div>
          <Stack direction="horizontal" gap={2} className="d-none d-sm-flex">
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
              <Button variant="primary" onClick={() => onUpdateStatus("paid")}>
                Mark
                <span className="d-none d-sm-inline-block">&nbsp;as Paid</span>
              </Button>
            )}
            {invoice?.status === "draft" && (
              <Button
                variant="primary"
                onClick={() => onUpdateStatus("pending")}
              >
                Send
                <span className="d-none d-sm-inline-block">&nbsp;Invoice</span>
              </Button>
            )}
          </Stack>
        </dl>
      </Card.Body>
    </Card>
  );
};

export default InvoicesDetailsHeader;
