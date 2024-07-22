import InvoicesModalForm from "~/components/invoices/modal-form";
import useInvoicesCreateModalForm from "~/hooks/invoices/use-create-modal-form";
import { InvoicesListHeader } from "~/components/invoices/list/list-header";
import InvoicesPager from "~/components/invoices/list/pager";
import { InvoicesListGroup } from "~/components/invoices/list/list-group";

export const InvoiceList = () => {
  const invoicesCreateModalForm = useInvoicesCreateModalForm();
  const {
    modal: { show },
  } = invoicesCreateModalForm;

  return (
    <>
      <InvoicesListHeader modalShow={show} />
      <InvoicesListGroup />
      <InvoicesPager />
      <InvoicesModalForm
        title="New Invoice"
        invoicesModalForm={invoicesCreateModalForm}
      />
    </>
  );
};

export default InvoiceList;
