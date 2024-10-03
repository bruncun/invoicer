import { useList, HttpError } from "@refinedev/core";
import { Invoice } from "~/types/invoices";
import { STATUSES } from "~/constants";
import useFilterPagination from "../use-filter-pagination";
import { Enums } from "~/types/supabase";

export type InvoicesList = ReturnType<typeof useList> & {
  currentPage: number;
  pageSize: number;
  filters: Enums<"status">[];
  setCurrentPage: (page: number) => void;
  setPageSize: (value: number) => void;
  setFilters: (filters: Enums<"status">[]) => void;
};

/**
 * Custom hook for fetching and managing a list of invoices.
 * @returns An object containing the invoices list and related state variables.
 */
const useInvoicesList = (): InvoicesList => {
  const {
    currentPage,
    pageSize,
    filters,
    setCurrentPage,
    setPageSize,
    setFilters,
  } = useFilterPagination();

  const invoicesList = useList<Invoice, HttpError>({
    resource: "invoices",
    filters: [
      {
        field: "status",
        operator: "in",
        value: filters.length > 0 ? filters : STATUSES,
      },
    ],
    sorters: [
      {
        field: "payment_due",
        order: "asc",
      },
    ],
    pagination: {
      current: currentPage,
      pageSize,
    },
    meta: {
      select: "*, items(*)",
    },
  });

  return {
    ...invoicesList,
    currentPage,
    pageSize,
    filters,
    setCurrentPage,
    setPageSize,
    setFilters,
  };
};

export default useInvoicesList;
