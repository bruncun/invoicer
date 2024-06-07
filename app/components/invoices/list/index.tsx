import { Tables } from "~/types/supabase";
import InvoicesListItem from "../list-item";
import InvoicesEmptyState from "../empty-state";

type InvoicesListGroupProps = {
  invoices: Array<Tables<"invoices">>;
  clients: Array<Tables<"clients">>;
};

export const InvoicesListGroup = ({
  invoices,
  clients,
}: InvoicesListGroupProps) => (
  <>
    {invoices.length > 0 ? (
      <ul data-testid="invoices-list" className="list-unstyled mt-4">
        {invoices.map((invoice, idx) => (
          <li
            key={invoice.id}
            className={idx !== invoices.length - 1 ? "mb-2" : ""}
          >
            <InvoicesListItem
              invoice={invoice}
              client={
                clients.find(
                  ({ id }) => invoice.clientId === id
                ) as Tables<"clients">
              }
            ></InvoicesListItem>
          </li>
        ))}
      </ul>
    ) : (
      <InvoicesEmptyState></InvoicesEmptyState>
    )}
  </>
);
