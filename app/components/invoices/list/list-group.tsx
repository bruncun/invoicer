import InvoicesListItem from "./list-item";
import type { InvoicesList } from "~/hooks/invoices/use-invoices-list";
import type { InferType } from "yup";
import { invoiceSchema } from "~/constants/schemas";
import emptyStateIllustration from "~/assets/illustration-empty-state.svg";

export const InvoicesListSkeleton = () => (
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

export const InvoicesListGroup = ({ invoicesList }: { invoicesList: InvoicesList }) => {
  const { data, isLoading } = invoicesList;
  const invoices = data?.data as Array<InferType<typeof invoiceSchema>>;

  if (isLoading) return <InvoicesListSkeleton />;

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
        <div
          className="d-flex align-items-center justify-content-center flex-grow-1 mt-7 mt-xl-9"
          data-testid="empty-state"
        >
          <div className="row w-100">
            <div className="col-9 col-sm-7 col-md-5 col-lg-4 col-xl-5 text-center mx-auto">
              <img
                src={emptyStateIllustration}
                width={242}
                height={200}
                alt="An illustration of a person standing in a envelope. They are holding a speakerphone and are surrounded by floating envelopes and paper airplanes."
                className="img-fluid mb-5"
              ></img>
              <h2 className="fs-5 mb-3">No invoices</h2>
              <p className="text-muted mb-7">
                Start by creating a new invoice.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
