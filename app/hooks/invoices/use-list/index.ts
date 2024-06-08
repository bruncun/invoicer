import { useState } from "react";
import { useList, useMany, HttpError } from "@refinedev/core";
import { Tables } from "~/types/supabase";
import { Status } from "~/types/invoices";
import { statuses } from "~/constants";

export const useInvoicesList = (pageSize: number, filters: Status[]) => {
  const [current, setCurrent] = useState(1);

  const { data: invoicesData, isLoading: isInvoicesLoading } = useList<
    Tables<"invoices">,
    HttpError
  >({
    filters: [
      {
        field: "status",
        operator: "in",
        value: filters.length > 0 ? filters : statuses,
      },
    ],
    pagination: {
      current,
      pageSize,
    },
  });

  const { data: clientsData, isLoading: isClientsLoading } = useMany<
    Tables<"clients">,
    HttpError
  >({
    resource: "clients",
    ids: invoicesData?.data?.map((item) => item?.clientId) ?? [],
    queryOptions: {
      enabled: !!invoicesData?.data,
    },
  });

  return {
    invoices: invoicesData?.data ?? [],
    total: invoicesData?.total ?? 0,
    clients: clientsData?.data ?? [],
    isLoading: isInvoicesLoading || isClientsLoading,
    current,
    setCurrent,
  };
};
