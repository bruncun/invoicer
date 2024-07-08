import { InvoicesListHeader } from "~/components/invoices/list-header";
import { InvoicesListGroup } from "~/components/invoices/list-group";
import InvoicesPager from "~/components/invoices/pager";
import InvoicesModalForm from "~/components/invoices/modal-form";
import useInvoicesCreateModalForm from "~/hooks/invoices/use-create-modal-form";
import useInvoicesList from "~/hooks/invoices/use-invoices-list";
import { useGetIdentity } from "@refinedev/core";

export const InvoiceList = () => {
  const invoicesList = useInvoicesList();
  const identity = useGetIdentity<{
    id: string;
  }>();
  const invoicesModalForm = useInvoicesCreateModalForm();
  const {
    invoicesCreateModalForm,
    invoicesCreateModalForm: {
      modal: { show },
    },
    onFinish,
  } = invoicesModalForm;

  return (
    <>
      <InvoicesListHeader modalShow={show} invoicesList={invoicesList} />
      <InvoicesListGroup invoicesList={invoicesList} />
      <InvoicesPager invoicesList={invoicesList} />
      <InvoicesModalForm
        title="New Invoice"
        invoicesCreateModalForm={invoicesCreateModalForm}
        identity={identity}
        onFinish={onFinish}
      />
    </>
  );
};

export default InvoiceList;
