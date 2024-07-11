import { useNavigation } from "@refinedev/core";
import { Button, Card } from "react-bootstrap";
import Icon from "~/components/icon";
import { StatusBadge } from "~/components/status-badge";
import useInvoicesShow from "~/hooks/invoices/use-show";
import InvoiceActions from "../actions";

type InvoicesDetailsHeaderProps = {
  modalShow: (id: number) => void;
  setShowConfirmationModal: (show: boolean) => void;
  onUpdateStatus: (status: "paid" | "pending") => void;
  showConfirmationModal: boolean;
  isUpdateLoading: boolean;
};

export const InvoicesDetailsHeader = ({
  modalShow,
  setShowConfirmationModal,
  onUpdateStatus,
  isUpdateLoading,
  showConfirmationModal,
}: InvoicesDetailsHeaderProps) => {
  const { invoice } = useInvoicesShow();
  const { goBack } = useNavigation();

  return (
    <>
      <Button variant="link" onClick={goBack} className="mb-3 user-select-none">
        <Icon name="chevron-left" className="me-2"></Icon>
        Go back
      </Button>
      <Card className="mb-2">
        <Card.Body className="px-sm-5 py-3">
          <dl className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center justify-content-between w-100 justify-content-sm-start w-sm-auto">
              <dt className="me-3 mb-0">Status</dt>
              <dd>
                <StatusBadge status={invoice?.status}></StatusBadge>
              </dd>
            </div>
            <InvoiceActions
              className="d-none d-sm-flex"
              invoice={invoice}
              modalShow={modalShow}
              setShowConfirmationModal={setShowConfirmationModal}
              onUpdateStatus={onUpdateStatus}
              showConfirmationModal={showConfirmationModal}
              isUpdateLoading={isUpdateLoading}
            />
          </dl>
        </Card.Body>
      </Card>
    </>
  );
};

export default InvoicesDetailsHeader;
