import { Button, Modal } from "react-bootstrap";

type InvoicesConfirmDeletionModal = {
  show: boolean;
  invoiceId?: number;
  setShowConfirmationModal: (value: boolean) => void;
  onDelete: () => void;
  isDeleteLoading: boolean;
};

const InvoicesConfirmDeletionModal = ({
  show,
  invoiceId,
  isDeleteLoading,
  setShowConfirmationModal,
  onDelete,
}: InvoicesConfirmDeletionModal) => (
  <Modal show={show} centered onHide={() => setShowConfirmationModal(false)}>
    <Modal.Header>
      <Modal.Title className="fs-5 fs-sm-4">Confirm Deletion</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>
        Are you sure you want to delete invoice{" "}
        <span className="fw-medium text-muted">
          #<span className="text-body-emphasis">{invoiceId}</span>
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

export default InvoicesConfirmDeletionModal;
