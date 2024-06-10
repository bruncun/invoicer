import { useShow } from "@refinedev/core";
import { InvoiceWithRelated } from "~/types/invoices";

const useInvoicesShow = () => {
  const { queryResult } = useShow({
    meta: {
      select:
        "*, client:client_id(*), senderAddress:sender_address_id(*), clientAddress:client_address_id(*), items(*)",
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
