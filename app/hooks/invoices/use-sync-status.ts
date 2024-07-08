import { useEffect } from "react";
import { UseFormWatch, UseFormHandleSubmit } from "react-hook-form";
import { InferType } from "yup";
import { invoiceSchema } from "~/constants";

const useSyncStatus = (
  watch: UseFormWatch<InferType<typeof invoiceSchema>>,
  handleSubmit: UseFormHandleSubmit<InferType<typeof invoiceSchema>>,
  isDirty: boolean,
  onFinish: (formData: InferType<typeof invoiceSchema>) => Promise<void>
) => {
  const status = watch("status");

  useEffect(() => {
    if (status && isDirty) handleSubmit(onFinish)();
  }, [status]);
};

export default useSyncStatus;
