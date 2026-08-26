import InvoiceActions from "./actions";
import MobileNavbar from "~/components/ui/mobile-navbar";
import type { InvoicesShow } from "~/hooks/invoices/use-show";

type InvoicesShowMobileNavbarProps = {
  editUrl: (id: number) => string;
  onUpdateStatus: (status: "pending" | "paid") => void;
  setShowConfirmationModal: (value: boolean) => void;
  showConfirmationModal: boolean;
  isUpdateLoading?: boolean;
  invoicesShow: InvoicesShow;
};

const InvoicesShowMobileNavbar = ({
  editUrl,
  onUpdateStatus,
  setShowConfirmationModal,
  isUpdateLoading,
  showConfirmationModal,
  invoicesShow,
}: InvoicesShowMobileNavbarProps) => (
  <MobileNavbar>
    <InvoiceActions
      invoicesShow={invoicesShow}
      editUrl={editUrl}
      setShowConfirmationModal={setShowConfirmationModal}
      onUpdateStatus={onUpdateStatus}
      showConfirmationModal={showConfirmationModal}
      isUpdateLoading={isUpdateLoading ?? false}
    />
  </MobileNavbar>
);

export default InvoicesShowMobileNavbar;
