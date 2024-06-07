import { useState } from "react";
import { InvoicesPageHeader } from "~/components/invoices/page-header";
import { InvoicesListGroup } from "~/components/invoices/list";
import FullScreenSpinner from "~/components/full-screen-spinner";
import InvoicesPager from "~/components/invoices/pager";
import { useInvoices } from "~/hooks/invoices/use-invoices";
import useInvoicesModalForm from "~/hooks/invoices/use-invoices-modal-form";
import InvoicesModalForm from "~/components/invoices/modal-form";
import { Status } from "~/types/invoices";
import { statuses } from "~/constants";

export const InvoiceList = () => {
  const { invoices, clients, total, isLoading, current, setCurrent } =
    useInvoices(10, statuses);
  const invoiceModalForm = useInvoicesModalForm();
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
    onFinishHandler,
    handleSubmit,
    errors,
    register,
  } = invoiceModalForm;
  const [filters, setFilters] = useState<Status[]>([]);
  const pageSize = 10;

  if (isLoading) return <FullScreenSpinner />;

  return (
    <>
      <InvoicesPageHeader
        filters={filters}
        setFilters={setFilters}
        modalShow={modalShow}
      ></InvoicesPageHeader>
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
    </>
  );
};

export default InvoiceList;
