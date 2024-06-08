import { Button, Card, Stack } from "react-bootstrap";
import { StatusBadge } from "~/components/status-badge";
import { InvoiceWithRelated, Status } from "~/types/invoices";

type InvoicesDetailsHeaderProps = {
  invoice?: InvoiceWithRelated;
  modalShow: (id: number) => void;
  setShowConfirmationModal: (show: boolean) => void;
  onUpdateStatus: (status: "paid" | "pending") => void;
  showConfirmationModal: boolean;
};

export const InvoicesDetailsHeader = ({
  invoice,
  modalShow,
  setShowConfirmationModal,
  onUpdateStatus,
  showConfirmationModal,
}: InvoicesDetailsHeaderProps) => (
  <Card className="mb-2">
    <Card.Body className="px-lg-5 py-3">
      <dl className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center justify-content-between w-100 justify-content-lg-start w-lg-auto">
          <dt className="me-3 mb-0">Status</dt>
          <dd>
            {invoice?.status && (
              <StatusBadge status={invoice?.status}></StatusBadge>
            )}
          </dd>
        </div>
        <Stack direction="horizontal" gap={2} className="d-none d-lg-flex">
          {invoice && invoice.id && (
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
              <span className="d-none d-lg-inline-block">&nbsp;as Paid</span>
            </Button>
          )}
          {invoice?.status === "draft" && (
            <Button variant="primary" onClick={() => onUpdateStatus("pending")}>
              Send
              <span className="d-none d-lg-inline-block">&nbsp;Invoice</span>
            </Button>
          )}
        </Stack>
      </dl>
    </Card.Body>
  </Card>
);

export default InvoicesDetailsHeader;
