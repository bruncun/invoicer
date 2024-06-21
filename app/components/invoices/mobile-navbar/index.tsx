import { Button, Navbar, Stack } from "react-bootstrap";
import { Invoice } from "~/types/invoices";
import { Tables } from "~/types/supabase";

const InvoicesMobileNavbar = ({
  modalShow,
  invoice,
  onUpdateStatus,
  setShowConfirmationModal,
  showConfirmationModal,
}: {
  modalShow: (id: number) => void;
  invoice?: Tables<"invoices">;
  onUpdateStatus: (status: "pending" | "paid") => void;
  setShowConfirmationModal: (value: boolean) => void;
  showConfirmationModal: boolean;
}) => {
  return (
    <Navbar
      fixed="bottom"
      className="mobile-navbar shadow-xl justify-content-end px-4 py-3 d-sm-none rounded-top-3 z-1"
    >
      <Stack direction="horizontal" gap={2}>
        {invoice?.id && invoice.status === "draft" && (
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
            Mark as Paid
          </Button>
        )}
        {invoice?.status === "draft" && (
          <Button variant="primary" onClick={() => onUpdateStatus("pending")}>
            Send Invoice
          </Button>
        )}
      </Stack>
    </Navbar>
  );
};

export default InvoicesMobileNavbar;
