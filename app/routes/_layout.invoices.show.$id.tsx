import { useBack } from "@refinedev/core";
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

export const InvoicesShow = () => {
  const goBack = useBack();
  const { invoice, isLoading: isInvoicesLoading, isError } = useInvoicesShow();
  const {
    modalShow,
    close,
    visible,
    handleSubmit,
    errors,
    register,
    fields,
    append,
    remove,
    items,
    isSubmitting,
    setShowConfirmationModal,
    showConfirmationModal,
    onSubmit,
    onUpdateStatus,
    onDelete,
    onFinish,
  } = useInvoicesEditModalForm(isInvoicesLoading, invoice);

  if (isError) return <FullScreenError />;

  return (
    <>
      <Button variant="link" onClick={goBack} className="mb-3">
        <Icon name="chevron-left" className="text-primary me-2"></Icon>
        Go back
      </Button>
      <InvoicesDetailsHeader
        modalShow={modalShow}
        onUpdateStatus={onUpdateStatus}
        setShowConfirmationModal={setShowConfirmationModal}
        showConfirmationModal={showConfirmationModal}
      ></InvoicesDetailsHeader>
      <InvoicesDetails />
      <InvoicesMobileNavbar
        modalShow={modalShow}
        invoice={invoice}
        onUpdateStatus={onUpdateStatus}
        setShowConfirmationModal={setShowConfirmationModal}
        showConfirmationModal={showConfirmationModal}
      ></InvoicesMobileNavbar>
      <InvoicesModalForm
        visible={visible}
        title={`Edit Invoice #${invoice?.id ?? ""}`}
        close={close}
        items={items}
        append={append}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        remove={remove}
        fields={fields}
        onFinish={onFinish}
        handleSubmit={handleSubmit}
        errors={errors}
        register={register}
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
