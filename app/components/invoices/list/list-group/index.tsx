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

  if (isLoading) {
    return (
      <ul
        data-testid="invoices-list"
        className="list-unstyled mt-3 mb-5 mb-md-2 d-flex flex-column gap-2"
      >
        {new Array(10).fill(null).map((invoice, idx) => (
          <li key={idx}>
            <InvoicesListItem invoice={invoice} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      {invoices?.length > 0 ? (
        <ul
          data-testid="invoices-list"
          className="list-unstyled mt-3 mb-5 mb-md-2 d-flex flex-column gap-2"
        >
          {invoices.map((invoice, idx) => (
            <li key={invoice.id}>
              <InvoicesListItem invoice={invoice} />
            </li>
          ))}
        </ul>
      ) : (
        <InvoicesEmptyState />
      )}
    </>
  );
};