import { HttpError, useShow } from "@refinedev/core";
import { Invoice } from "~/types/invoices";
import { Tables } from "~/types/supabase";

export type InvoicesShow = {
  invoice: Invoice | undefined;
  isLoading: boolean;
  isError: boolean;
};

const useInvoicesShow = () => {
  const { queryResult } = useShow<
    Tables<"invoices"> & { items: Tables<"items">[] },
    HttpError,
    Tables<"invoices"> & { items: Tables<"items">[] }
  >({
    meta: {
      select: "*, items(*)",
    },
  });
  const { data, isLoading, isError } = queryResult;

  const invoice = data?.data as Invoice;

  if (!invoice && !isLoading) {
    throw new Response(null, {
      status: 404,
      statusText: "Invoice not found",
    });
  }

  return { invoice, isLoading, isError };
};

export default useInvoicesShow;
