import { useBack } from "@refinedev/core";
import { Button } from "react-bootstrap";
import Icon from "~/components/icon";
import FullScreenSpinner from "~/components/full-screen-spinner";
import InvoicesModalForm from "~/components/invoices/modal-form";
import InvoicesDetails from "~/components/invoices/details";
import InvoicesDetailsHeader from "~/components/invoices/details-header";
import useInvoicesEditModalForm from "~/hooks/invoices/use-edit-modal-form";
import InvoicesConfirmDeletionModal from "~/components/invoices/confirm-deletion-modal";
import InvoicesMobileNavbar from "~/components/invoices/mobile-navbar";
import useInvoicesShow from "~/hooks/invoices/use-show";

export const InvoicesShow = () => {
  const goBack = useBack();
  const { invoice, isInvoicesLoading } = useInvoicesShow();
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
    onDeleteHandler,
    onFinishHandler,
  } = useInvoicesEditModalForm(invoice, isInvoicesLoading);

  if (isInvoicesLoading) return <FullScreenSpinner />;

  return (
    <>
      <div className="mb-3 d-none d-sm-block">
        <Button variant="link" onClick={goBack}>
          <Icon name="chevron-left" className="text-primary me-2"></Icon>
          Go back
        </Button>
      </div>
      <InvoicesDetailsHeader
        modalShow={modalShow}
        invoice={invoice}
        onUpdateStatus={onUpdateStatus}
        setShowConfirmationModal={setShowConfirmationModal}
        showConfirmationModal={showConfirmationModal}
      ></InvoicesDetailsHeader>
      <InvoicesDetails invoice={invoice}></InvoicesDetails>
      <InvoicesMobileNavbar
        goBack={goBack}
        modalShow={modalShow}
        invoice={invoice}
        onUpdateStatus={onUpdateStatus}
        setShowConfirmationModal={setShowConfirmationModal}
        showConfirmationModal={showConfirmationModal}
      ></InvoicesMobileNavbar>
      <InvoicesModalForm
        visible={visible}
        title={`Edit Invoice #${invoice.id}`}
        close={close}
        items={items}
        append={append}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        remove={remove}
        fields={fields}
        onFinishHandler={onFinishHandler}
        handleSubmit={handleSubmit}
        errors={errors}
        register={register}
      ></InvoicesModalForm>
      <InvoicesConfirmDeletionModal
        show={showConfirmationModal}
        invoiceId={invoice.id}
        setShowConfirmationModal={setShowConfirmationModal}
        onDeleteHandler={onDeleteHandler}
      ></InvoicesConfirmDeletionModal>
    </>
  );
};

export default InvoicesShow;
