import {
  BaseKey,
  useGetIdentity,
  useNavigation,
  useNotification,
  useUpdate,
} from "@refinedev/core";
import InvoicesModalForm from "~/components/invoices/modal-form";
import InvoicesDetails from "~/components/invoices/show/details";
import InvoicesDetailsHeader from "~/components/invoices/show/details-header";
import useInvoicesEditModalForm from "~/hooks/invoices/use-edit-modal-form";
import InvoicesConfirmDeletionModal from "~/components/invoices/show/confirm-deletion-modal";
import InvoicesShowMobileNavbar from "~/components/invoices/mobile-navbar";
import useInvoicesShow from "~/hooks/invoices/use-show";
import FullScreenError from "~/components/full-screen-error";
import { useState } from "react";
import useInvoiceDelete from "~/hooks/invoices/use-invoice-delete";
import { supabaseClient } from "~/utility/supabase";

export const InvoicesShow = () => {
  const identity = useGetIdentity<{
    id: string;
  }>();
  const { invoice, isLoading: isInvoicesLoading, isError } = useInvoicesShow();
  const { deleteInvoice, isDeleteLoading } = useInvoiceDelete();
  const invoicesModalForm = useInvoicesEditModalForm(
    isInvoicesLoading,
    invoice
  );
  const {
    invoicesEditModalForm,
    invoicesEditModalForm: {
      modal: { show },
    },
    onFinish,
  } = invoicesModalForm;
  const { mutateAsync: mutateUpdateAsync } = useUpdate();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
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
    deleteInvoice(invoice);
    list("invoices");
    open?.({
      description: "Invoice deleted",
      message: "success",
      type: "success",
    });
    setShowConfirmationModal(false);
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
      <InvoicesShowMobileNavbar
        modalShow={show}
        invoice={invoice}
        onUpdateStatus={onUpdateStatus}
        isUpdateLoading={isUpdateLoading}
        setShowConfirmationModal={setShowConfirmationModal}
        showConfirmationModal={showConfirmationModal}
      ></InvoicesShowMobileNavbar>
      <InvoicesModalForm
        title={
          <>
            Edit <span className="text-muted">#</span>
            {invoice?.id}
          </>
        }
        identity={identity}
        invoicesCreateModalForm={invoicesEditModalForm}
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
