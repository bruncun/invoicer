import { useGo, useNavigation } from "@refinedev/core";
import { Button, Card, Stack } from "react-bootstrap";
import Icon from "~/components/icon";
import Skeleton from "~/components/skeleton";
import { StatusBadge } from "~/components/status-badge";
import useInvoicesShow from "~/hooks/invoices/use-show";

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
            <Stack direction="horizontal" gap={2} className="d-none d-sm-flex">
              {!invoice ? (
                <>
                  <Skeleton
                    className="w-6 rounded-pill"
                    style={{ height: "2.625rem" }}
                  />
                  <Skeleton
                    className="w-6 rounded-pill"
                    style={{ height: "2.625rem" }}
                  />
                  <Skeleton
                    className="w-9 rounded-pill"
                    style={{ height: "2.625rem" }}
                  />
                </>
              ) : (
                <>
                  {invoice && invoice.id && invoice.status === "draft" && (
                    <Button
                      variant="secondary"
                      onClick={() => modalShow(invoice.id)}
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    onClick={() =>
                      setShowConfirmationModal(!showConfirmationModal)
                    }
                  >
                    Delete
                  </Button>
                  {invoice?.status === "pending" && (
                    <Button
                      variant="primary"
                      onClick={() => onUpdateStatus("paid")}
                      disabled={isUpdateLoading}
                    >
                      {isUpdateLoading ? (
                        "Marking..."
                      ) : (
                        <>
                          Mark
                          <span className="d-none d-sm-inline-block">
                            &nbsp;as Paid
                          </span>
                        </>
                      )}
                    </Button>
                  )}
                  {invoice?.status === "draft" && (
                    <Button
                      variant="primary"
                      onClick={() => onUpdateStatus("pending")}
                      disabled={isUpdateLoading}
                    >
                      {isUpdateLoading ? (
                        "Sending..."
                      ) : (
                        <>
                          Send
                          <span className="d-none d-sm-inline-block">
                            &nbsp;Invoice
                          </span>
                        </>
                      )}
                    </Button>
                  )}
                </>
              )}
            </Stack>
          </dl>
        </Card.Body>
      </Card>
    </>
  );
};

export default InvoicesDetailsHeader;
