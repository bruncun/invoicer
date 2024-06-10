import { InvoicesListHeader } from "~/components/invoices/list-header";
import { InvoicesListGroup } from "~/components/invoices/list-group";
import FullScreenSpinner from "~/components/full-screen-spinner";
import InvoicesPager from "~/components/invoices/pager";
import InvoicesModalForm from "~/components/invoices/modal-form";
import { useInvoicesList } from "~/hooks/invoices/use-list";
import useInvoicesCreateModalForm from "~/hooks/invoices/use-create-modal-form";
import { useState } from "react";
import { Status } from "~/types/invoices";

export const InvoiceList = () => {
  const [filters, setFilters] = useState<Status[]>([]);
  const pageSize = 10;
  const { invoices, clients, total, isLoading, current, setCurrent } =
    useInvoicesList(pageSize, filters);
  const invoiceModalForm = useInvoicesCreateModalForm();
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
  } = invoiceModalForm;

  if (isLoading) return <FullScreenSpinner />;

  return (
    <>
      <InvoicesListHeader
        modalShow={modalShow}
        setFilters={setFilters}
        filters={filters}
      ></InvoicesListHeader>
      <InvoicesListGroup
        invoices={invoices}
        clients={clients}
      ></InvoicesListGroup>
      {invoices && total > 0 ? (
        <InvoicesPager
          invoices={invoices}
          pageSize={pageSize}
          current={current}
          setCurrent={setCurrent}
        ></InvoicesPager>
      ) : null}
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
