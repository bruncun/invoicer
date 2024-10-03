import InvoiceActions from "./actions";
import MobileNavbar from "~/components/ui/mobile-navbar";

type InvoicesShowMobileNavbarProps = {
  modalShow: (id: number) => void;
  onUpdateStatus: (status: "pending" | "paid") => void;
  setShowConfirmationModal: (value: boolean) => void;
  showConfirmationModal: boolean;
  isUpdateLoading?: boolean;
};

const InvoicesShowMobileNavbar = ({
  modalShow,
  onUpdateStatus,
  setShowConfirmationModal,
  isUpdateLoading,
  showConfirmationModal,
}: InvoicesShowMobileNavbarProps) => (
  <MobileNavbar>
    <InvoiceActions
      modalShow={modalShow}
      setShowConfirmationModal={setShowConfirmationModal}
      onUpdateStatus={onUpdateStatus}
      showConfirmationModal={showConfirmationModal}
      isUpdateLoading={isUpdateLoading ?? false}
    />
  </MobileNavbar>
);

export default InvoicesShowMobileNavbar;
