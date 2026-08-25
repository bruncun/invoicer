import { useState } from "react";
import { InferType } from "yup";
import { invoiceSchema } from "~/constants";
import { invoiceAction } from "~/utility/invoices/action";

const useInvoiceCreate = () => {
  const [isCreateLoading, setIsCreateLoading] = useState(false);

  const createInvoice = async (data: InferType<typeof invoiceSchema>) => {
    const { items, ...rest } = data;
    const invoiceValues = { ...rest };
    setIsCreateLoading(true);
    try {
      const invoice = await invoiceAction({
        operation: "create",
        invoice: invoiceValues,
        items,
      });
      return { data: invoice };
    } finally {
      setIsCreateLoading(false);
    }
  };

  return {
    createInvoice,
    isCreateLoading,
  };
};

export default useInvoiceCreate;
