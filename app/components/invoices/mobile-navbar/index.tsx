import { Button, Navbar, Stack } from "react-bootstrap";
import { Tables } from "~/types/supabase";

type InvoiceMobileNavbarProps = {
  modalShow: (id: number) => void;
  invoice?: Tables<"invoices">;
  onUpdateStatus: (status: "pending" | "paid") => void;
  setShowConfirmationModal: (value: boolean) => void;
  showConfirmationModal: boolean;
};

const InvoicesMobileNavbar = ({
  modalShow,
  invoice,
  onUpdateStatus,
  setShowConfirmationModal,
  showConfirmationModal,
}: InvoiceMobileNavbarProps) => (
  <Navbar
    fixed="bottom"
    className="mobile-navbar shadow-xl justify-content-end px-4 py-3 d-sm-none z-1 border"
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

export default InvoicesMobileNavbar;
