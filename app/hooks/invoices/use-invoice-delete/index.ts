import { useState } from "react";
import type { InferType } from "yup";
import { invoiceSchema } from "~/constants/schemas";
import { invoiceAction } from "~/utility/invoices/action";

const useInvoiceDelete = () => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const deleteInvoice = async (invoice?: InferType<typeof invoiceSchema>) => {
    setIsDeleteLoading(true);
    try {
      await invoiceAction({ operation: "delete", invoice: { id: invoice?.id } });
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return {
    deleteInvoice,
    isDeleteLoading,
  };
};

export default useInvoiceDelete;
