import { useDeleteMany, useDelete, BaseKey } from "@refinedev/core";
import { useState } from "react";
import { InferType } from "yup";
import { invoiceSchema } from "~/constants";

const useInvoiceDelete = () => {
  const { mutateAsync: mutateDeleteManyAsync } = useDeleteMany();
  const { mutateAsync: mutateDeleteAsync } = useDelete();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const deleteInvoice = async (invoice?: InferType<typeof invoiceSchema>) => {
    setIsDeleteLoading(true);
    await mutateDeleteManyAsync({
      resource: "items",
      ids: invoice?.items.map((item) => item.id) as Array<BaseKey>,
      successNotification: false,
    });
    await mutateDeleteAsync({
      resource: "invoices",
      id: invoice?.id as BaseKey,
      successNotification: false,
    }),
      setIsDeleteLoading(false);
  };

  return {
    deleteInvoice,
    isDeleteLoading,
  };
};

export default useInvoiceDelete;
