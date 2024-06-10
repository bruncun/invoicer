import { useShow } from "@refinedev/core";
import { InvoiceWithRelated } from "~/types/invoices";

const useInvoicesShow = () => {
  const { queryResult } = useShow({
    meta: {
      select: "*, items(*)",
    },
  });
  const { data, isLoading, isError } = queryResult;

  const invoice = data?.data as InvoiceWithRelated;

  if (!invoice && !isLoading) {
    throw new Response(null, {
      status: 404,
      statusText: "Invoice not found",
    });
  }

  return { invoice, isLoading, isError };
};

export default useInvoicesShow;
