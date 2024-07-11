import { Navbar } from "react-bootstrap";
import { Tables } from "~/types/supabase";
import InvoiceActions from "../actions";

type InvoicesShowMobileNavbarProps = {
  modalShow: (id: number) => void;
  invoice?: Tables<"invoices">;
  onUpdateStatus: (status: "pending" | "paid") => void;
  setShowConfirmationModal: (value: boolean) => void;
  showConfirmationModal: boolean;
  isUpdateLoading?: boolean;
};

const InvoicesShowMobileNavbar = ({
  modalShow,
  invoice,
  onUpdateStatus,
  setShowConfirmationModal,
  isUpdateLoading,
  showConfirmationModal,
}: InvoicesShowMobileNavbarProps) => (
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

export default InvoicesShowMobileNavbar;
