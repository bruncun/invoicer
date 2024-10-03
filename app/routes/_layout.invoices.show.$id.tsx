import {
  BaseKey,
  useBack,
  useDelete,
  useDeleteMany,
  useNavigation,
  useNotification,
  useUpdate,
} from "@refinedev/core";
import { Button } from "react-bootstrap";
import Icon from "~/components/icon";
import InvoicesModalForm from "~/components/invoices/modal-form";
import InvoicesDetails from "~/components/invoices/details";
import InvoicesDetailsHeader from "~/components/invoices/details-header";
import useInvoicesEditModalForm from "~/hooks/invoices/use-edit-modal-form";
import InvoicesConfirmDeletionModal from "~/components/invoices/confirm-deletion-modal";
import InvoicesMobileNavbar from "~/components/invoices/mobile-navbar";
import useInvoicesShow from "~/hooks/invoices/use-show";
import FullScreenError from "~/components/full-screen-error";
import { useState } from "react";

export const InvoicesShow = () => {
  const goBack = useBack();
  const { invoice, isLoading: isInvoicesLoading, isError } = useInvoicesShow();
  const invoicesModalForm = useInvoicesEditModalForm(
    isInvoicesLoading,
    invoice
  );
  const {
    invoicesEditModalForm,
    invoicesEditModalForm: {
      modal: { show },
    },
    onSubmit,
    onFinish,
    itemsFieldArray,
  } = invoicesModalForm;
  const { mutateAsync: mutateUpdateAsync } = useUpdate();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const { mutateAsync: mutateDeleteManyAsync } = useDeleteMany();
  const { mutateAsync: mutateDeleteAsync } = useDelete();
  const { list } = useNavigation();
  const { open } = useNotification();

  if (isError) return <FullScreenError />;

  const onUpdateStatus = (status: "paid" | "pending") => {
    mutateUpdateAsync({
      resource: "invoices",
      id: invoice?.id as BaseKey,
      values: {
        status,
      },
      successNotification: {
        type: "success",
        message: "success",
        description: `Invoice marked as ${status}`,
      },
      mutationMode: "optimistic",
    });
  };

  const onDelete = async () => {
    try {
      await Promise.all([
        mutateDeleteManyAsync({
          resource: "items",
          ids: invoice?.items.map((item) => item.id) as Array<BaseKey>,
          successNotification: false,
        }),
        mutateDeleteAsync({
          resource: "invoices",
          id: invoice?.id as BaseKey,
          successNotification: false,
        }),
      ]);
      open?.({
        description: "Invoice deleted",
        message: "success",
        type: "success",
      });
      list("invoices");
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <>
      <Button variant="link" onClick={goBack} className="mb-3 user-select-none">
        <Icon name="chevron-left" className="me-2"></Icon>
        Go back
      </Button>
      <InvoicesDetailsHeader
        modalShow={show}
        onUpdateStatus={onUpdateStatus}
        setShowConfirmationModal={setShowConfirmationModal}
        showConfirmationModal={showConfirmationModal}
      ></InvoicesDetailsHeader>
      <InvoicesDetails />
      <InvoicesMobileNavbar
        modalShow={show}
        invoice={invoice}
        onUpdateStatus={onUpdateStatus}
        setShowConfirmationModal={setShowConfirmationModal}
        showConfirmationModal={showConfirmationModal}
      ></InvoicesMobileNavbar>
      <InvoicesModalForm
        itemsFieldArray={itemsFieldArray}
        invoicesCreateModalForm={invoicesEditModalForm}
        onSubmit={onSubmit}
        onFinish={onFinish}
      ></InvoicesModalForm>
      <InvoicesConfirmDeletionModal
        show={showConfirmationModal}
        invoiceId={invoice?.id}
        setShowConfirmationModal={setShowConfirmationModal}
        onDelete={onDelete}
      ></InvoicesConfirmDeletionModal>
    </>
  );
};

export default InvoicesShow;
