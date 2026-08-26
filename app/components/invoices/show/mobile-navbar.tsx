import InvoiceActions from "./actions";
import MobileNavbar from "~/components/ui/mobile-navbar";

type InvoicesShowMobileNavbarProps = {
  editUrl: (id: number) => string;
  onUpdateStatus: (status: "pending" | "paid") => void;
  setShowConfirmationModal: (value: boolean) => void;
  showConfirmationModal: boolean;
  isUpdateLoading?: boolean;
};

const InvoicesShowMobileNavbar = ({
  editUrl,
  onUpdateStatus,
  setShowConfirmationModal,
  isUpdateLoading,
  showConfirmationModal,
}: InvoicesShowMobileNavbarProps) => (
  <MobileNavbar>
    <InvoiceActions
      editUrl={editUrl}
      setShowConfirmationModal={setShowConfirmationModal}
      onUpdateStatus={onUpdateStatus}
      showConfirmationModal={showConfirmationModal}
      isUpdateLoading={isUpdateLoading ?? false}
    />
  </MobileNavbar>
);

export default InvoicesShowMobileNavbar;
