import { Tables } from "~/types/supabase";
import InvoiceActions from "../actions";
import MobileNavbar from "~/components/ui/mobile-navbar";

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
  <MobileNavbar>
    <InvoiceActions
      invoice={invoice}
      modalShow={modalShow}
      setShowConfirmationModal={setShowConfirmationModal}
      onUpdateStatus={onUpdateStatus}
      showConfirmationModal={showConfirmationModal}
      isUpdateLoading={isUpdateLoading ?? false}
    />
  </MobileNavbar>
);

export default InvoicesShowMobileNavbar;
