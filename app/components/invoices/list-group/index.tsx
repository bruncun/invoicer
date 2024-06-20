import InvoicesListItem from "../list-item";
import InvoicesEmptyState from "../empty-state";
import { Invoice } from "~/types/invoices";
import { InvoicesList } from "~/hooks/invoices/use-invoices-list";

type InvoicesListGroupProps = {
  invoicesList: InvoicesList;
};

export const InvoicesListGroup = ({
  invoicesList: { data, isLoading, isRefetching },
}: InvoicesListGroupProps) => {
  const invoices = data?.data as Array<Invoice>;

  return (
    <>
      {invoices?.length > 0 || isLoading || isRefetching ? (
        <ul
          data-testid="invoices-list"
          className="list-unstyled mt-3 mb-2 pb-2"
        >
          {invoices?.map((invoice, idx) => (
            <li
              key={invoice.id}
              className={
                idx !== invoices?.length - 1
                  ? "my-2 border border-transparent"
                  : ""
              }
            >
              <InvoicesListItem
                invoice={invoice}
                isLoading={isLoading}
              ></InvoicesListItem>
            </li>
          ))}
        </ul>
      ) : (
        <InvoicesEmptyState></InvoicesEmptyState>
      )}
    </>
  );
};
