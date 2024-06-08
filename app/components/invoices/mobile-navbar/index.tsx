import { Button, Navbar, Stack } from "react-bootstrap";
import { InvoiceWithRelated } from "~/types/invoices";

const InvoicesMobileNavbar = ({
  goBack,
  modalShow,
  invoice,
  onUpdateStatus,
  setShowConfirmationModal,
  showConfirmationModal,
}: {
  goBack: () => void;
  modalShow: (id: number) => void;
  invoice: InvoiceWithRelated;
  onUpdateStatus: (status: "pending" | "paid") => void;
  setShowConfirmationModal: (value: boolean) => void;
  showConfirmationModal: boolean;
}) => {
  return (
    <Navbar
      fixed="bottom"
      bg="body"
      className="shadow-lg justify-content-between px-4 py-3 d-sm-none rounded-top-5"
    >
      <Button variant="link" onClick={goBack}>
        Go Back
      </Button>
      <Stack direction="horizontal" gap={2}>
        <Button variant="secondary" onClick={() => modalShow(invoice.id)}>
          Edit
        </Button>
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
    </Navbar>
  );
};

export default InvoicesMobileNavbar;
