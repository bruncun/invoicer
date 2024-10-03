import { useNavigation, useNotification } from "@refinedev/core";
import { Button, Modal } from "react-bootstrap";
import useInvoiceDelete from "~/hooks/invoices/use-invoice-delete";
import useInvoicesShow from "~/hooks/invoices/use-show";

type InvoicesConfirmDeletionModal = {
  show: boolean;
  setShowConfirmationModal: (value: boolean) => void;
};

const InvoicesConfirmDeletionModal = ({
  show,
  setShowConfirmationModal,
}: InvoicesConfirmDeletionModal) => {
  const { deleteInvoice, isDeleteLoading } = useInvoiceDelete();
  const { invoice } = useInvoicesShow();
  const { list } = useNavigation();
  const { open } = useNotification();

  const onDelete = () => {
    deleteInvoice(invoice);
    list("invoices");
    open?.({
      description: "Invoice deleted",
      message: "success",
      type: "success",
    });
    setShowConfirmationModal(false);
  };

  return (
    <Modal show={show} centered onHide={() => setShowConfirmationModal(false)}>
      <Modal.Header>
        <Modal.Title className="fs-5 fs-sm-4">Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you want to delete invoice{" "}
          <span className="fw-medium text-muted">
            #<span className="text-body-emphasis">{invoice?.id}</span>
          </span>
          ?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="link" onClick={() => setShowConfirmationModal(false)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onDelete} disabled={isDeleteLoading}>
          {isDeleteLoading ? "Deleting..." : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoicesConfirmDeletionModal;
