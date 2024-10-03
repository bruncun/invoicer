import { Button, Form } from "react-bootstrap";
import Icon from "~/components/icon";
import Skeleton from "~/components/skeleton";
import useInvoicesList from "~/hooks/invoices/use-invoices-list";
import Select from "~/components/select";

export const InvoicesPager = () => {
  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    data,
    isLoading,
  } = useInvoicesList();
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
        <div className="d-flex flex-nowrap align-items-center w-100 w-xl-auto">
          <div className="dropup d-xl-flex flex-nowrap align-items-center me-2 d-none">
            <Form.Label className="flex-shrink-0 mb-0 me-2">
              Rows per page
            </Form.Label>
            <Select
              value={pageSize.toString()}
              onChange={(value) => {
                setPageSize(Number(value));
              }}
              options={[10, 20, 50, 100].map((size) => ({
                value: size.toString(),
                label: size.toString(),
              }))}
              buttonClassName="form-select text-start w-100 border-transparent"
              listboxOptionsStyle={{
                bottom: "2.75rem",
              }}
            />
          </div>
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
