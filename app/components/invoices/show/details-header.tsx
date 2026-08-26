import { Button, Card } from "react-bootstrap";
import Icon from "~/components/icon";
import { StatusBadge } from "~/components/status-badge";
import type { InvoicesShow } from "~/hooks/invoices/use-show";
import InvoiceActions from "./actions";
import { Link } from "@remix-run/react";
import { useNavigation } from "@refinedev/core";

type InvoicesDetailsHeaderProps = {
  editUrl: (id: number) => string;
  setShowConfirmationModal: (show: boolean) => void;
  onUpdateStatus: (status: "paid" | "pending") => void;
  showConfirmationModal: boolean;
  isUpdateLoading: boolean;
  invoicesShow: InvoicesShow;
};

export const InvoicesDetailsHeader = ({
  editUrl,
  setShowConfirmationModal,
  onUpdateStatus,
  isUpdateLoading,
  showConfirmationModal,
  invoicesShow,
}: InvoicesDetailsHeaderProps) => {
  const { invoice } = invoicesShow;
  const { listUrl } = useNavigation();

  return (
    <>
      <Link
        to={listUrl("invoices")}
        prefetch="intent"
        className="btn btn-link mb-3 user-select-none"
      >
        <Icon name="chevron-left" className="me-2" aria-hidden="true" />
        Go back
      </Link>
      <Card className="mb-2">
        <Card.Body className="px-sm-5 py-3">
          <dl className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center justify-content-sm-between w-100 justify-content-sm-start w-sm-auto">
              <dt className="me-3 mb-0">Status</dt>
              <dd>
                <StatusBadge status={invoice?.status}></StatusBadge>
              </dd>
            </div>
            <InvoiceActions
              invoicesShow={invoicesShow}
              className="d-none d-md-flex"
              editUrl={editUrl}
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
