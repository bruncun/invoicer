import { InvoicesListHeader } from "~/components/invoices/list-header";
import { InvoicesListGroup } from "~/components/invoices/list-group";
import InvoicesPager from "~/components/invoices/pager";
import InvoicesModalForm from "~/components/invoices/modal-form";
import useInvoicesCreateModalForm from "~/hooks/invoices/use-create-modal-form";
import useInvoicesList from "~/hooks/invoices/use-invoices-list";

export const InvoiceList = () => {
  const invoicesList = useInvoicesList();
  const invoicesModalForm = useInvoicesCreateModalForm();
  const {
    visible,
    close,
    modalShow,
    items,
    append,
    onSubmit,
    isSubmitting,
    remove,
    fields,
    onFinish,
    handleSubmit,
    errors,
    register,
  } = invoicesModalForm;

  return (
    <>
      <InvoicesListHeader modalShow={modalShow} invoicesList={invoicesList} />
      <InvoicesListGroup invoicesList={invoicesList} />
      <InvoicesPager invoicesList={invoicesList} />
      <InvoicesModalForm
        visible={visible}
        title="New Invoice"
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
    </>
  );
};

export default InvoiceList;
