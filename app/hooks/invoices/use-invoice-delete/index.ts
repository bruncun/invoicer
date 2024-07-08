import { useDeleteMany, useDelete, BaseKey } from "@refinedev/core";
import { useState } from "react";
import { Invoice } from "~/types/invoices";

const useInvoiceDelete = () => {
  const { mutateAsync: mutateDeleteManyAsync } = useDeleteMany();
  const { mutateAsync: mutateDeleteAsync } = useDelete();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const deleteInvoice = async (invoice?: Invoice) => {
    setIsDeleteLoading(true);
    await Promise.all([
      mutateDeleteManyAsync({
        resource: "items",
        ids: invoice?.items.map((item) => item.id) as Array<BaseKey>,
        successNotification: false,
        mutationMode: "optimistic",
      }),
      mutateDeleteAsync({
        resource: "invoices",
        id: invoice?.id as BaseKey,
        successNotification: false,
        mutationMode: "optimistic",
      }),
    ]);
    setIsDeleteLoading(false);
  };

  return {
    deleteInvoice,
    isDeleteLoading,
  };
};

export default useInvoiceDelete;
