import {
  BaseKey,
  useDelete,
  useDeleteMany,
  useNavigation,
  useNotification,
  useUpdate,
} from "@refinedev/core";
import InvoicesModalForm from "~/components/invoices/modal-form";
import InvoicesDetails from "~/components/invoices/details";
import InvoicesDetailsHeader from "~/components/invoices/details-header";
import useInvoicesEditModalForm from "~/hooks/invoices/use-edit-modal-form";
import InvoicesConfirmDeletionModal from "~/components/invoices/confirm-deletion-modal";
import InvoicesMobileNavbar from "~/components/invoices/mobile-navbar";
import useInvoicesShow from "~/hooks/invoices/use-show";
import FullScreenError from "~/components/full-screen-error";
import { useState } from "react";
import { supabaseClient } from "~/utility";

export const InvoicesShow = () => {
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
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const { list } = useNavigation();
  const { open } = useNotification();

  if (isError) return <FullScreenError />;

  const onUpdateStatus = async (status: "paid" | "pending") => {
    setIsUpdateLoading(true);
    if (status === "pending") {
      await supabaseClient.functions.invoke("send-invoice", {
        body: invoice,
      });
    }
    mutateUpdateAsync({
      resource: "invoices",
      id: invoice?.id as BaseKey,
      values: {
        status,
      },
      successNotification: {
        type: "success",
        message: "success",
        description:
          status === "pending"
            ? "Invoice updated and sent"
            : "Invoice marked as paid",
      },
      mutationMode: "optimistic",
    });
    setIsUpdateLoading(false);
  };

  const onDelete = async () => {
    try {
      setIsDeleteLoading(true);
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
      setIsDeleteLoading(false);
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <>
      <InvoicesDetailsHeader
        modalShow={show}
        onUpdateStatus={onUpdateStatus}
        isUpdateLoading={isUpdateLoading}
        setShowConfirmationModal={setShowConfirmationModal}
        showConfirmationModal={showConfirmationModal}
      ></InvoicesDetailsHeader>
      <InvoicesDetails />
      <InvoicesMobileNavbar
        modalShow={show}
        invoice={invoice}
        onUpdateStatus={onUpdateStatus}
        isUpdateLoading={isUpdateLoading}
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
        isDeleteLoading={isDeleteLoading}
      ></InvoicesConfirmDeletionModal>
    </>
  );
};

export default InvoicesShow;
