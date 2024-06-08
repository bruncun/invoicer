import { useShow } from "@refinedev/core";
import { InvoiceWithRelated } from "~/types/invoices";

const useInvoicesShow = () => {
  const { queryResult } = useShow({
    meta: {
      select:
        "*, client:clientId(*), senderAddress:senderAddressId(*), clientAddress:clientAddressId(*), items(*)",
    },
  });
  const { data: invoiceData, isLoading: isInvoicesLoading } = queryResult;

  const invoice = invoiceData?.data as InvoiceWithRelated;

  return { invoice, isInvoicesLoading };
};

export default useInvoicesShow;
