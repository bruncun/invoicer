import { BaseKey, useUpdate } from "@refinedev/core";
import InvoicesModalForm from "~/components/invoices/modal-form";
import InvoicesDetails from "~/components/invoices/show/details";
import InvoicesDetailsHeader from "~/components/invoices/show/details-header";
import useInvoicesEditModalForm from "~/hooks/invoices/use-edit-modal-form";
import InvoicesConfirmDeletionModal from "~/components/invoices/show/confirm-deletion-modal";
import useInvoicesShow from "~/hooks/invoices/use-show";
import { useState } from "react";
import { supabaseClient } from "~/utility/supabase";
import InvoicesShowMobileNavbar from "~/components/invoices/show/mobile-navbar";

export const InvoicesShow = () => {
  const { invoice, isLoading: isInvoicesLoading } = useInvoicesShow();
  const invoicesModalEditForm = useInvoicesEditModalForm(
    isInvoicesLoading,
    invoice
  );
  const {
    modal: { show },
  } = invoicesModalEditForm;
  const { mutateAsync: mutateUpdateAsync } = useUpdate();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

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

  return (
    <>
      <InvoicesDetailsHeader
        modalShow={show}
        onUpdateStatus={onUpdateStatus}
        isUpdateLoading={isUpdateLoading}
        setShowConfirmationModal={setShowConfirmationModal}
        showConfirmationModal={showConfirmationModal}
      />
      <InvoicesDetails />
      <InvoicesShowMobileNavbar
        modalShow={show}
        onUpdateStatus={onUpdateStatus}
        isUpdateLoading={isUpdateLoading}
        setShowConfirmationModal={setShowConfirmationModal}
        showConfirmationModal={showConfirmationModal}
      />
      <InvoicesModalForm
        title={
          <>
            Edit <span className="text-muted">#</span>
            {invoice?.id}
          </>
        }
        invoicesModalForm={invoicesModalEditForm}
      />
      <InvoicesConfirmDeletionModal
        show={showConfirmationModal}
        setShowConfirmationModal={setShowConfirmationModal}
      />
    </>
  );
};

export default InvoicesShow;
