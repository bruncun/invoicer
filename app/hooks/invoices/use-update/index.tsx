import { useState } from "react";
import type { InferType } from "yup";
import { invoiceSchema } from "~/constants/schemas";
import { invoiceAction } from "~/utility/invoices/action";

const useInvoiceUpdate = () => {
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const updateInvoice = async (
    data: InferType<typeof invoiceSchema>
  ) => {
    const { items, invoice_date, ...invoice } = data;

    setIsUpdateLoading(true);
    try {
      await invoiceAction({
        operation: "update",
        invoice: { ...invoice, id: data.id },
        items,
      });
    } finally {
      setIsUpdateLoading(false);
    }
  };

  return {
    updateInvoice,
    isUpdateLoading,
  };
};

export default useInvoiceUpdate;
