import { Tables } from "~/types/supabase";
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
  <>
    {invoices.length > 0 ? (
      <ul data-testid="invoices-list" className="list-unstyled mt-4">
        {invoices.map((invoice, idx) => (
          <li
            key={invoice.id}
            className={idx !== invoices.length - 1 ? "mb-2" : ""}
          >
            <InvoicesListItem invoice={invoice}></InvoicesListItem>
          </li>
        ))}
      </ul>
    ) : (
      <InvoicesEmptyState></InvoicesEmptyState>
    )}
  </>
);
