import { useState } from "react";
import { useList, HttpError } from "@refinedev/core";
import { Tables } from "~/types/supabase";
import { Status } from "~/types/invoices";
import { STATUSES } from "~/constants";

export type InvoicesList = ReturnType<typeof useList> & {
  currentState: [number, React.Dispatch<React.SetStateAction<number>>];
  filterState: [Status[], React.Dispatch<React.SetStateAction<Status[]>>];
  pageSizeState: [number, React.Dispatch<React.SetStateAction<number>>];
};

/**
 * Custom hook for fetching and managing a list of invoices.
 * @returns An object containing the invoices list and related state variables.
 */
export const useInvoicesList = (): InvoicesList => {
  const currentState = useState(1);
  const pageSizeState = useState(10);
  const filterState = useState<Status[]>([]);
  const [current] = currentState;
  const [filters] = filterState;
  const [pageSize] = pageSizeState;
  const invoicesList = useList<Tables<"invoices">, HttpError>({
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
      mode: "client",
      current,
      pageSize,
    },
    meta: {
      select: "*, items(*)",
    },
  });

  return {
    ...invoicesList,
    currentState,
    filterState,
    pageSizeState,
  };
};
