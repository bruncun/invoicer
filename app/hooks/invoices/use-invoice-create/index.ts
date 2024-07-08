import { useCreateMany, useCreate } from "@refinedev/core";
import { useState } from "react";
import { InferType } from "yup";
import { invoiceSchema } from "~/constants";

const useInvoiceCreate = () => {
  const { mutateAsync } = useCreate();
  const { mutateAsync: mutateManyAsync } = useCreateMany();
  const [isCreateLoading, setIsCreateLoading] = useState(false);

  const createInvoice = async (data: InferType<typeof invoiceSchema>) => {
    const { items, ...rest } = data;
    const invoiceValues = { ...rest };
    setIsCreateLoading(true);
    const invoice = await mutateAsync({
      resource: "invoices",
      values: invoiceValues,
      successNotification: false,
    });
    await mutateManyAsync({
      resource: "items",
      values: items.map((item) => ({
        invoice_id: invoice.data.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        user_id: data.user_id,
      })),
      successNotification: false,
    });
    setIsCreateLoading(false);

    return invoice;
  };

  return {
    createInvoice,
    isCreateLoading,
  };
};

export default useInvoiceCreate;
