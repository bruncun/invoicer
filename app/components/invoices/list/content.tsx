import InvoicesPager from "./pager";
import { InvoicesListGroup } from "./list-group";
import useInvoicesList from "~/hooks/invoices/use-invoices-list";

export default function InvoicesListContent({
  initialData,
}: {
  initialData: Parameters<typeof useInvoicesList>[0];
}) {
  const invoicesList = useInvoicesList(initialData);

  return (
    <>
      <InvoicesListGroup invoicesList={invoicesList} />
      <InvoicesPager invoicesList={invoicesList} />
    </>
  );
}
