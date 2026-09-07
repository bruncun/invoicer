import InvoicesPager from "./pager";
import { InvoicesListGroup } from "./list-group";
import useInvoicesList from "~/hooks/invoices/use-invoices-list";

export default function InvoicesListContent({
  initialData,
  isDemoUser,
}: {
  initialData: Parameters<typeof useInvoicesList>[0];
  isDemoUser: boolean;
}) {
  const invoicesList = useInvoicesList(initialData);

  return (
    <>
      <InvoicesListGroup invoicesList={invoicesList} isDemoUser={isDemoUser} />
      {!(invoicesList.isLoading && !isDemoUser) && (
        <InvoicesPager invoicesList={invoicesList} />
      )}
    </>
  );
}
