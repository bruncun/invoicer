import { useUpdate, BaseKey, useCreate, useDelete } from "@refinedev/core";
import { useState } from "react";
import { InferType } from "yup";
import { invoiceSchema, itemSchema } from "~/constants";

const useInvoiceUpdate = () => {
  const { mutateAsync: mutateDeleteAsync } = useDelete();
  const { mutateAsync: mutateCreateAsync } = useCreate();
  const { mutateAsync: mutateUpdateAsync } = useUpdate();
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const updateInvoice = async (
    data: InferType<typeof invoiceSchema>,
    originalItems: InferType<typeof itemSchema>[] = []
  ) => {
    const { items, invoice_date, ...invoice } = data;

    const newItems = data.items.filter((item) => !item.id);
    const submittedItemIds = new Set(
      data.items
        .map((item) => item.id)
        .filter((id): id is number => id !== undefined)
    );
    const deletedItems = originalItems.filter(
      (item) => item.id !== undefined && !submittedItemIds.has(item.id)
    );
    const updatedItems = data.items.filter((item) => item.id) as Array<
      InferType<typeof itemSchema>
    >;

    setIsUpdateLoading(true);
    try {
      await Promise.all([
      ...updatedItems.map((item) =>
        mutateUpdateAsync({
          resource: "items",
          id: item.id,
          values: {
            invoice_id: data.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            user_id: data.user_id,
          },
          successNotification: false,
        })
      ),
      ...newItems.map((item) =>
        mutateCreateAsync({
          resource: "items",
          values: {
            invoice_id: data.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            user_id: data.user_id,
          },
          successNotification: false,
        })
      ),
      ...deletedItems.map((item) =>
        mutateDeleteAsync({
          resource: "items",
          id: item.id,
          successNotification: false,
        })
      ),
      mutateUpdateAsync({
        resource: "invoices",
        id: data.id as BaseKey,
        values: invoice,
        successNotification: false,
      }),
      ]);
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
