import InvoicesListItem from "../list-item";
import InvoicesEmptyState from "../empty-state";
import { InvoicesList } from "~/hooks/invoices/use-invoices-list";
import { InferType } from "yup";
import { invoiceSchema } from "~/constants";

type InvoicesListGroupProps = {
  invoicesList: InvoicesList;
};

export const InvoicesListGroup = ({
  invoicesList: { data, isLoading },
}: InvoicesListGroupProps) => {
  const invoices = data?.data as Array<InferType<typeof invoiceSchema>>;

  if (isLoading)
    return (
      <ul
        data-testid="invoices-list"
        className="list-unstyled my-3 mb-md-2 d-flex flex-column gap-2"
      >
        {new Array(10).fill(null).map((invoice, idx) => (
          <li key={idx}>
            <InvoicesListItem invoice={invoice} />
          </li>
        ))}
      </ul>
    );

  return (
    <>
      {invoices?.length > 0 ? (
        <ul
          data-testid="invoices-list"
          className="list-unstyled my-3 mb-md-2 d-flex flex-column gap-2"
        >
          {invoices.map((invoice) => (
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
