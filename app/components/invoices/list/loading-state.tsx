import { Button } from "react-bootstrap";
import FormattedId from "~/components/formatted-id";
import Icon from "~/components/icon";
import Skeleton from "~/components/skeleton";
import { StatusBadge } from "~/components/status-badge";

function InvoiceListItemSkeleton() {
  return (
    <div className="card border border-transparent">
      <div className="card-body d-xl-flex justify-content-between align-items-center px-xl-4 py-xl-2 d-none border border-transparent">
        <div className="me-3 ms-3 w-7">
          <FormattedId />
        </div>
        <span className="me-5 pe-4 w-10 text-muted text-nowrap fs-0">
          <Skeleton />
        </span>
        <span className="text-muted lh-1 text-truncate w-10 d-inline-block fs-0">
          <Skeleton className="w-7" />
        </span>
        <span className="flex-grow-1 justify-content-end d-flex fw-medium text-body-emphasis fs-0">
          <Skeleton className="w-7" />
        </span>
        <div className="ms-5 me-3">
          <StatusBadge />
        </div>
        <Button variant="link" className="text-primary opacity-0">
          <Icon name="chevron-right" />
        </Button>
      </div>
      <div className="card-body d-xl-none justify-content-between align-items-start">
        <div className="d-flex justify-content-between mb-2 d-xl-none lh-1">
          <h2 className="card-title h5 fs-6">
            <FormattedId />
          </h2>
          <span className="text-truncate d-inline-block w-10 text-end">
            <Skeleton className="w-8" />
          </span>
        </div>
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ height: "2.625rem" }}
        >
          <div>
            <span className="d-block mb-2 lh-1">
              <Skeleton />
            </span>
            <div
              className="card-title fs-6 mb-0 text-body-emphasis lh-1"
              style={{ height: "1rem" }}
            >
              <Skeleton className="w-7" />
            </div>
          </div>
          <div>
            <StatusBadge />
          </div>
        </div>
      </div>
    </div>
  );
}

function InvoicesListSpinner() {
  return (
    <div
      className="d-flex align-items-center justify-content-center flex-grow-1 mt-7 mt-xl-9"
      role="status"
    >
      <div className="row w-100">
        <div className="col-9 col-md-5 text-center mx-auto">
          <span className="spinner-border spinner-border-sm text-primary" />
          <span className="visually-hidden">Loading invoices</span>
        </div>
      </div>
    </div>
  );
}

export function InvoicesListLoadingState({
  showSkeleton,
}: {
  showSkeleton: boolean;
}) {
  if (!showSkeleton) return <InvoicesListSpinner />;

  return (
    <>
      <ul
        data-testid="invoices-list"
        className="list-unstyled my-3 mb-md-2 d-flex flex-column gap-2"
      >
        {new Array(10).fill(null).map((_, index) => (
          <li key={index} className="invoice-list-deferred-content">
            <InvoiceListItemSkeleton />
          </li>
        ))}
      </ul>
      <InvoicesPagerSkeleton />
    </>
  );
}

function InvoicesPagerSkeleton() {
  return (
    <div className="invoice-list-pager-deferred d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center justify-content-between w-100">
        <span className="text-muted fs-6 lh-1 d-xl-inline-block d-none">
          <Skeleton className="w-11 bg-secondary" style={{ width: "6rem" }} />
        </span>
        <div className="d-flex flex-nowrap align-items-center w-100 w-xl-auto flex-shrink-0">
          <div className="dropup d-xl-flex flex-nowrap align-items-center me-2 d-none">
            <label className="form-label flex-shrink-0 mb-0 me-2">Rows per page</label>
            <div style={{ width: "3.75rem", minWidth: "4.5rem" }}>
              <button
                type="button"
                disabled
                aria-label="Rows per page"
                className="form-select select-toggle text-start w-100 border-transparent rows-per-page-select btn btn-link text-nowrap"
              >
                10
              </button>
            </div>
          </div>
          <div className="d-flex justify-content-between w-100 d-xl-inline-block w-xl-auto">
            <Button variant="link" className="rounded-3" disabled>
              <Icon name="arrow-left me-2" />
              Previous
            </Button>
            <Button variant="link" className="rounded-3" disabled>
              Next
              <Icon name="arrow-right ms-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
