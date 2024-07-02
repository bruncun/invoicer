import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import { Button, Form } from "react-bootstrap";
import { onChange } from "react-toastify/dist/core/store";
import { Fragment } from "react/jsx-runtime";
import Icon from "~/components/icon";
import Skeleton from "~/components/skeleton";
import { InvoicesList } from "~/hooks/invoices/use-invoices-list";
import InvoiceList from "~/routes/_layout.invoices._index";

type InvoicesPagerProps = {
  invoicesList: InvoicesList;
};

export const InvoicesPager = ({
  invoicesList: {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    data,
    isLoading,
    isRefetching,
  },
}: InvoicesPagerProps) => {
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / pageSize);
  const isNextPageAvailable = total >= pageSize * currentPage + 1;
  const formattedTotal = new Intl.NumberFormat("en-US").format(total);

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
            <Form.Label className="flex-shrink-0 mb-0">
              Rows per page
            </Form.Label>
            <Listbox value={pageSize} onChange={setPageSize}>
              <ListboxButton className="form-select text-start w-100 border-transparent">
                {pageSize}
              </ListboxButton>
              <ListboxOptions
                className="dropdown-menu show d-grid gap-1 p-2 rounded-3 text-body-emphasis border outline-0 listbox-options"
                style={{ width: "var(--button-width)", bottom: "2.75rem" }}
              >
                {[10, 20, 50, 100].map((size) => (
                  <ListboxOption key={size} value={size}>
                    {({ focus, selected }) => (
                      <div
                        className={`dropdown-item rounded-2 px-2 ${
                          selected ? "bg-primary text-white" : ""
                        }
                                    ${
                                      focus && !selected
                                        ? "bg-body-tertiary text-body-emphasis"
                                        : ""
                                    }`}
                      >
                        <Icon
                          name="check-lg"
                          className={`text-primary me-2 ${
                            selected ? "text-white" : "opacity-0"
                          }`}
                        />
                        {size}
                      </div>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Listbox>
          </div>
          <div className="d-flex justify-content-between w-100 d-xl-inline-block w-xl-auto">
            <Button
              variant="link"
              className="rounded-3 user-select-none"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <Icon name="arrow-left me-2"></Icon>
              Previous
            </Button>
            <Button
              variant="link"
              className="rounded-3 user-select-none"
              onClick={() => setCurrentPage(currentPage + 1)}
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
