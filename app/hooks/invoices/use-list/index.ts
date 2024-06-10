import { useState } from "react";
import { useList, useMany, HttpError } from "@refinedev/core";
import { Tables } from "~/types/supabase";
import { Status } from "~/types/invoices";
import { STATUSES } from "~/constants";

export const useInvoicesList = (pageSize: number, filters: Status[]) => {
  const [current, setCurrent] = useState(1);

  const { data: invoicesData, isLoading: isInvoicesLoading } = useList<
    Tables<"invoices">,
    HttpError
  >({
    resource: "invoices",
    filters: [
      {
        field: "status",
        operator: "in",
        value: filters.length > 0 ? filters : STATUSES,
      },
    ],
    pagination: {
      current,
      pageSize,
    },
    meta: {
      select: "*, items(*)",
    },
  });

  return {
    invoices: (invoicesData?.data ?? []) as Array<
      Tables<"invoices"> & { items: Array<Tables<"items">> }
    >,
    total: invoicesData?.total ?? 0,
    isLoading: isInvoicesLoading,
    current,
    setCurrent,
  };
};
