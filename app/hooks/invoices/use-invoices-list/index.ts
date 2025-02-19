import { useList, HttpError } from "@refinedev/core";
import { invoiceSchema, STATUSES } from "~/constants";
import useFilterPagination from "../use-filter-pagination";
import { Enums } from "~/types/supabase";
import { InferType } from "yup";

export type InvoicesList = ReturnType<typeof useList> & {
  currentPage: number;
  pageSize: number;
  filters: Enums<"status">[];
  setCurrentPage: (page: number) => void;
  setPageSize: (value: number) => void;
  setFilters: (filters: Enums<"status">[]) => void;
};

const useInvoicesList = (): InvoicesList => {
  const {
    currentPage,
    pageSize,
    filters,
    setCurrentPage,
    setPageSize,
    setFilters,
  } = useFilterPagination();

  const invoicesList = useList<InferType<typeof invoiceSchema>, HttpError>({
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
