import { yupResolver } from "@hookform/resolvers/yup";
import { HttpError, useNotification } from "@refinedev/core";
import { useModalForm } from "@refinedev/react-hook-form";
import { parseISO, formatDate, sub } from "date-fns";
import { useEffect } from "react";
import { InferType } from "yup";
import { invoiceSchema } from "~/constants";
import useInvoiceUpdate from "../use-update";

const useInvoicesEditModalForm = (
  isInvoicesLoading: boolean,
  invoice?: InferType<typeof invoiceSchema>
) => {
  const { updateInvoice } = useInvoiceUpdate();
  const invoicesEditModalForm = useModalForm<
    InferType<typeof invoiceSchema>,
    HttpError,
    InferType<typeof invoiceSchema>
  >({
    syncWithLocation: true,
    refineCoreProps: {
      resource: "invoices",
      action: "edit",
      successNotification: false,
      meta: {
        select: "*, items(*)",
      },
    },
    resolver: yupResolver(invoiceSchema),
  });
  const {
    reset,
    modal: { close },
    setValue,
    formState: { errors },
  } = invoicesEditModalForm;
  const { open } = useNotification();
  console.log(errors);

  useEffect(() => {
    if (!isInvoicesLoading && invoice) {
      const invoice_date = sub(parseISO(invoice.payment_due), {
        days: parseInt(invoice.payment_terms),
      });
      const formatted_invoice_date = formatDate(invoice_date, "yyyy-MM-dd");
      setValue("invoice_date", formatted_invoice_date);

      reset(invoice);
    }
  }, [invoice, isInvoicesLoading]);

  useEffect(() => {
    if (invoice) {
      const invoice_date = sub(parseISO(invoice.payment_due), {
        days: parseInt(invoice.payment_terms),
      });
      const formatted_invoice_date = formatDate(invoice_date, "yyyy-MM-dd");
      setValue("invoice_date", formatted_invoice_date);
    }
  }, [invoice]);

  const onFinish = async (formData: InferType<typeof invoiceSchema>) => {
    try {
      updateInvoice(formData);
      open?.({
        description: `Invoice updated${
          formData.status === "draft" ? "" : " and sent"
        }`,
        message: "success",
        type: "success",
      });

      close();
      reset();
    } catch {
      open?.({
        description: "Sorry, something went wrong - please try again",
        message: "error",
        type: "error",
      });
    }
  };

  return {
    ...invoicesEditModalForm,
    onFinish,
  };
};

export default useInvoicesEditModalForm;
