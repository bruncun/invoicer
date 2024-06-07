import { Tables } from "~/types/supabase";
import { Col, Row } from "react-bootstrap";
import emptyStateIllustration from "~/assets/illustration-empty-state.svg";
import InvoicesListItem from "../list-item";
import InvoicesEmptyState from "../empty-state";

export const InvoicesList = ({
  invoices,
  clients,
}: {
  invoices: Array<Tables<"invoices">>;
  clients: Array<Tables<"clients">>;
}) => {
  return (
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
};
