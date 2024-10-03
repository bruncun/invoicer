import { InvoicesListHeader } from "~/components/invoices/list-header";
import { InvoicesListGroup } from "~/components/invoices/list-group";
import InvoicesPager from "~/components/invoices/pager";
import InvoicesModalForm from "~/components/invoices/modal-form";
import useInvoicesCreateModalForm from "~/hooks/invoices/use-create-modal-form";
import useInvoicesList from "~/hooks/invoices/use-invoices-list";
import { useState } from "react";

export const InvoiceList = () => {
  const invoicesList = useInvoicesList();
  const invoicesModalForm = useInvoicesCreateModalForm();
  const {
    invoicesCreateModalForm,
    invoicesCreateModalForm: {
      modal: { show },
    },
    itemsFieldArray,
    onSubmit,
    onFinish,
  } = invoicesModalForm;

  return (
    <>
      <InvoicesListHeader modalShow={show} invoicesList={invoicesList} />
      <InvoicesListGroup invoicesList={invoicesList} />
      <InvoicesPager invoicesList={invoicesList} />
      <InvoicesModalForm
        title="New Invoice"
        itemsFieldArray={itemsFieldArray}
        invoicesCreateModalForm={invoicesCreateModalForm}
        onSubmit={onSubmit}
        onFinish={onFinish}
      ></InvoicesModalForm>
    </>
  );
};

export default InvoiceList;
