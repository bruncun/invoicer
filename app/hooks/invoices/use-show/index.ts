import { GetOneResponse, HttpError, useShow } from "@refinedev/core";
import type { InferType } from "yup";
import { invoiceSchema } from "~/constants/schemas";

export type InvoicesShow = {
  invoice: InferType<typeof invoiceSchema> | undefined;
  isLoading: boolean;
  isError: boolean;
};

const useInvoicesShow = (
  initialData?: GetOneResponse<InferType<typeof invoiceSchema>>
) => {
  const { result, query } = useShow<
    InferType<typeof invoiceSchema>,
    HttpError,
    InferType<typeof invoiceSchema>
  >({
    meta: {
      select: "*, items(*)",
    },
    queryOptions: {
      initialData,
      staleTime: 30_000,
    },
  });
  const { isLoading, isError } = query;
  const invoice = result as InferType<typeof invoiceSchema> | undefined;
  const isPending = isLoading;

  if (!invoice && !isPending) {
    throw new Response(null, {
      status: 404,
      statusText: "Invoice not found",
    });
  }

  return {
    invoice,
    isLoading: isPending,
    isError,
  };
};

export default useInvoicesShow;
