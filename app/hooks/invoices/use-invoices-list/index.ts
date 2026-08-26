import { useList, HttpError, GetListResponse } from "@refinedev/core";
import { invoiceSchema, STATUSES } from "~/constants";
import useFilterPagination from "../use-filter-pagination";
import { Enums } from "~/types/supabase";
import { InferType } from "yup";

export type Invoice = InferType<typeof invoiceSchema>;
export type InvoicesList = ReturnType<typeof useList<Invoice, HttpError>> & {
  data: GetListResponse<Invoice>;
  isLoading: boolean;
  isError: boolean;
  currentPage: number;
  pageSize: number;
  filters: Enums<"status">[];
  setCurrentPage: (page: number) => void;
  setPageSize: (value: number) => void;
  setFilters: (filters: Enums<"status">[]) => void;
};

const useInvoicesList = (initialData?: GetListResponse<Invoice>): InvoicesList => {
  const {
    currentPage,
    pageSize,
    filters,
    setCurrentPage,
    setPageSize,
    setFilters,
  } = useFilterPagination();

  const invoicesQuery = useList<Invoice, HttpError>({
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
      currentPage,
      pageSize,
    },
    meta: {
      select: "*, items(*)",
    },
    queryOptions: {
      initialData:
        currentPage === 1 && pageSize === 10 && filters.length === 0
          ? initialData
          : undefined,
      staleTime: 30_000,
    },
  });

  return {
    ...invoicesQuery,
    data: { data: invoicesQuery.result.data, total: invoicesQuery.result.total },
    isLoading: invoicesQuery.query.isLoading,
    isError: invoicesQuery.query.isError,
    currentPage,
    pageSize,
    filters,
    setCurrentPage,
    setPageSize,
    setFilters,
  } as InvoicesList;
};

export default useInvoicesList;
