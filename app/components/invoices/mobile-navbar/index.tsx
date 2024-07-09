import { Navbar } from "react-bootstrap";
import { Tables } from "~/types/supabase";
import InvoiceActions from "../show/actions";

type InvoiceMobileNavbarProps = {
  modalShow: (id: number) => void;
  invoice?: Tables<"invoices">;
  onUpdateStatus: (status: "pending" | "paid") => void;
  setShowConfirmationModal: (value: boolean) => void;
  showConfirmationModal: boolean;
  isUpdateLoading?: boolean;
};

const InvoicesMobileNavbar = ({
  modalShow,
  invoice,
  onUpdateStatus,
  setShowConfirmationModal,
  isUpdateLoading,
  showConfirmationModal,
}: InvoiceMobileNavbarProps) => (
  <Navbar
    fixed="bottom"
    className="mobile-navbar shadow-xl justify-content-end px-4 py-3 d-sm-none z-1 border-top bg-body"
  >
    <InvoiceActions
      invoice={invoice}
      modalShow={modalShow}
      setShowConfirmationModal={setShowConfirmationModal}
      onUpdateStatus={onUpdateStatus}
      showConfirmationModal={showConfirmationModal}
      isUpdateLoading={isUpdateLoading ?? false}
    />
  </Navbar>
);

export default InvoicesMobileNavbar;
