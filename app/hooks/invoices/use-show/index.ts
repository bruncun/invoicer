import { HttpError, useShow } from "@refinedev/core";
import { InferType } from "yup";
import { invoiceSchema } from "~/constants";

export type InvoicesShow = {
  invoice: InferType<typeof invoiceSchema> | undefined;
  isLoading: boolean;
  isError: boolean;
};

const useInvoicesShow = () => {
  const { queryResult } = useShow<
    InferType<typeof invoiceSchema>,
    HttpError,
    InferType<typeof invoiceSchema>
  >({
    meta: {
      select: "*, items(*)",
    },
  });
  const { data, isLoading, isError } = queryResult;

  const invoice = data?.data as InferType<typeof invoiceSchema>;

  if (!invoice && !isLoading) {
    throw new Response(null, {
      status: 404,
      statusText: "Invoice not found",
    });
  }

  return { invoice, isLoading, isError };
};

export default useInvoicesShow;
