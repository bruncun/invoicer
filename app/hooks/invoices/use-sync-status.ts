import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import { useEffect } from "react";
import { InferType } from "yup";
import { invoiceSchema } from "~/constants";

const useSyncStatus = (
  invoicesModalForm: UseModalFormReturnType<InferType<typeof invoiceSchema>>,
  onFinish: (formData: InferType<typeof invoiceSchema>) => Promise<void>
) => {
  const {
    handleSubmit,
    watch,
    formState: { isDirty },
  } = invoicesModalForm;

  const status = watch("status");

  useEffect(() => {
    if (status && isDirty) handleSubmit(onFinish)();
  }, [status]);
};

export default useSyncStatus;
