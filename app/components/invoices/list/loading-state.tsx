import { Button } from "react-bootstrap";
import FormattedId from "~/components/formatted-id";
import Icon from "~/components/icon";
import Skeleton from "~/components/skeleton";
import { StatusBadge } from "~/components/status-badge";
import { InvoicesPagerSkeleton } from "./pager";

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
          <Skeleton className="w-6" />
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
            <Skeleton className="w-7" />
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
              <Skeleton className="w-6" />
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

export function InvoicesListLoadingState() {
  return (
    <>
      <ul
        data-testid="invoices-list"
        className="list-unstyled my-3 mb-md-2 d-flex flex-column gap-2"
      >
        {new Array(10).fill(null).map((_, index) => (
          <li key={index}>
            <InvoiceListItemSkeleton />
          </li>
        ))}
      </ul>
      <InvoicesPagerSkeleton />
    </>
  );
}
