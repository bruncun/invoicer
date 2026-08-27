import { Button, Form } from "react-bootstrap";
import Icon from "~/components/icon";
import Skeleton from "~/components/skeleton";
import type { InvoicesList } from "~/hooks/invoices/use-invoices-list";
import Select from "~/components/select";
import useFilterPagination from "~/hooks/invoices/use-filter-pagination";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100].map((size) => ({
  value: size.toString(),
  label: size.toString(),
}));

const RowsPerPageControl = ({
  pageSize = 10,
  isLoading = false,
  onChange = () => undefined,
}: {
  pageSize?: number;
  isLoading?: boolean;
  onChange?: (value: string) => void;
}) => (
  <div className="dropup d-xl-flex flex-nowrap align-items-center me-2 d-none">
    <Form.Label className="flex-shrink-0 mb-0 me-2">Rows per page</Form.Label>
    <div style={{ width: "3.75rem", minWidth: "4.5rem" }}>
      <Select
        value={pageSize.toString()}
        onChange={onChange}
        options={PAGE_SIZE_OPTIONS}
        disabled={isLoading}
        buttonClassName="text-start w-100 border-transparent rows-per-page-select"
        listboxOptionsStyle={{
          bottom: "2.75rem",
        }}
      />
    </div>
  </div>
);

export const InvoicesPagerSkeleton = () => {
  const { pageSize } = useFilterPagination();

  return (
    <div className="d-flex justify-content-between align-items-center">
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
    <div className="d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center justify-content-between w-100">
        <span className="text-muted fs-6 lh-1 d-xl-inline-block d-none">
          {isLoading ? (
            <Skeleton
              className="w-11 bg-secondary"
              style={{ width: "18rem" }}
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
