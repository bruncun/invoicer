import { Button } from "react-bootstrap";
import { lazy, Suspense, useCallback, useState } from "react";
import Icon from "~/components/icon";
import Skeleton from "~/components/skeleton";
import type { InvoicesList } from "~/hooks/invoices/use-invoices-list";
import useFilterPagination from "~/hooks/invoices/use-filter-pagination";
import { loadDropdownStyles } from "./load-dropdown-styles";

let rowsPerPageSelectPromise:
  | Promise<typeof import("./rows-per-page-select")>
  | undefined;

const loadRowsPerPageSelect = () =>
  (rowsPerPageSelectPromise ??= Promise.all([
    import("./rows-per-page-select"),
    loadDropdownStyles(),
  ]).then(([module]) => module));

const LazyRowsPerPageSelect = lazy(loadRowsPerPageSelect);

const RowsPerPageControl = ({
  pageSize = 10,
  isLoading = false,
  onChange = () => undefined,
}: {
  pageSize?: number;
  isLoading?: boolean;
  onChange?: (value: string) => void;
}) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const prepareSelect = useCallback(() => {
    void loadRowsPerPageSelect();
  }, []);
  const openSelect = useCallback(() => {
    prepareSelect();
    setIsSelectOpen(true);
  }, [prepareSelect]);

  return (
    <div className="dropup d-xl-flex flex-nowrap align-items-center me-2 d-none">
      <label className="form-label flex-shrink-0 mb-0 me-2">Rows per page</label>
      <div style={{ width: "3.75rem", minWidth: "4.5rem" }}>
        {isSelectOpen ? (
          <Suspense
            fallback={
              <RowsPerPageButton
                pageSize={pageSize}
                disabled={isLoading}
                onIntent={prepareSelect}
                onClick={openSelect}
              />
            }
          >
            <LazyRowsPerPageSelect
              pageSize={pageSize}
              isLoading={isLoading}
              onChange={onChange}
            />
          </Suspense>
        ) : (
          <RowsPerPageButton
            pageSize={pageSize}
            disabled={isLoading}
            onIntent={prepareSelect}
            onClick={openSelect}
          />
        )}
      </div>
    </div>
  );
};

function RowsPerPageButton({
  pageSize,
  disabled,
  onIntent,
  onClick,
}: {
  pageSize: number;
  disabled: boolean;
  onIntent: () => void;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label="Rows per page"
      aria-haspopup="listbox"
      aria-expanded={false}
      className="form-select select-toggle text-start w-100 border-transparent rows-per-page-select btn btn-link text-nowrap"
      onPointerEnter={onIntent}
      onFocus={onIntent}
      onClick={onClick}
    >
      {pageSize}
    </button>
  );
}

export const InvoicesPagerSkeleton = () => {
  const { pageSize } = useFilterPagination();

  return (
    <div className="invoice-list-pager-deferred d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center justify-content-between w-100">
        <span className="text-muted fs-6 lh-1 d-xl-inline-block d-none">
          <Skeleton className="w-11 bg-secondary" style={{ width: "8rem" }} />
        </span>
        <div className="d-flex flex-nowrap align-items-center w-100 w-xl-auto flex-shrink-0">
          <RowsPerPageControl pageSize={pageSize} isLoading />
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
};

export const InvoicesPager = ({ invoicesList }: { invoicesList: InvoicesList }) => {
  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    data,
    isLoading,
  } = invoicesList;
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / pageSize);
  const isNextPageAvailable = total >= pageSize * currentPage + 1;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (total === 0 && !isLoading) return null;

  return (
    <div className="invoice-list-pager-deferred d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center justify-content-between w-100">
        <span className="text-muted fs-6 lh-1 d-xl-inline-block d-none">
          {isLoading ? (
            <Skeleton
              className="w-11 bg-secondary"
              style={{ width: "6rem" }}
            />
          ) : (
            <>
              Page <span className="">{currentPage}</span> of{" "}
              <span className="">{totalPages}</span>
            </>
          )}
        </span>
        <div className="d-flex flex-nowrap align-items-center w-100 w-xl-auto flex-shrink-0">
          <RowsPerPageControl
            pageSize={pageSize}
            isLoading={isLoading}
            onChange={(value) => setPageSize(Number(value))}
          />
          <div className="d-flex justify-content-between w-100 d-xl-inline-block w-xl-auto">
            <Button
              variant="link"
              className="rounded-3 user-select-none"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              <Icon name="arrow-left me-2"></Icon>
              Previous
            </Button>
            <Button
              variant="link"
              className="rounded-3 user-select-none"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!isNextPageAvailable || isLoading}
            >
              Next
              <Icon name="arrow-right ms-2"></Icon>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicesPager;
