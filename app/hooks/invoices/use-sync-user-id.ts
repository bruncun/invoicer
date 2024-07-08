import { UseGetIdentityReturnType } from "@refinedev/core/dist/hooks/auth/useGetIdentity";
import { useEffect } from "react";
import { UseFormSetValue } from "react-hook-form";
import { InferType } from "yup";
import { invoiceSchema } from "~/constants";

function useSyncUserId(
  setValue: UseFormSetValue<InferType<typeof invoiceSchema>>,
  identity: UseGetIdentityReturnType<{
    id: string;
  }>
) {
  const { data = null, isLoading = false } = identity ?? {};

  useEffect(() => {
    if (!isLoading && data) setValue("user_id", data.id);
  }, [data]);
}

export default useSyncUserId;
