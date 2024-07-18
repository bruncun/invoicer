import { yupResolver } from "@hookform/resolvers/yup";
import { HttpError, useGetIdentity, useNotification } from "@refinedev/core";
import { useModalForm } from "@refinedev/react-hook-form";
import { parseISO, formatDate, sub } from "date-fns";
import { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { Asserts, InferType } from "yup";
import { invoiceSchema } from "~/constants";
import { Enums } from "~/types/supabase";
import useInvoiceUpdate from "../use-update";

const useInvoicesEditModalForm = (
  isInvoicesLoading: boolean,
  invoice?: InferType<typeof invoiceSchema>
) => {
  const { data: identity, isLoading: isIdentityLoading } = useGetIdentity<{
    id: string;
  }>();
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
    control,
    reset,
    modal: { close },
    setValue,
  } = invoicesEditModalForm;
  const { open } = useNotification();

  const itemsFieldArray = useFieldArray<InferType<typeof invoiceSchema>>({
    control,
    name: "items",
  });

  useEffect(() => {
    if (!isInvoicesLoading && invoice) {
      const invoice_date = sub(parseISO(invoice.payment_due), {
        days: parseInt(invoice.payment_terms),
      });
      const formatted_invoice_date = formatDate(invoice_date, "yyyy-MM-dd");
      setValue("invoice_date", formatted_invoice_date);

      const newInvoice: InferType<typeof invoiceSchema> = {
        sender_street: invoice.sender_street,
        sender_city: invoice.sender_city,
        sender_postcode: invoice.sender_postcode,
        sender_country: invoice.sender_country,
        client_name: invoice.client_name,
        client_email: invoice.client_email,
        client_street: invoice.client_street,
        client_city: invoice.client_city,
        client_postcode: invoice.client_postcode,
        client_country: invoice.client_country,
        payment_due: invoice.payment_due,
        payment_terms: invoice.payment_terms,
        invoice_date: formatted_invoice_date,
        description: invoice.description,
        items: invoice.items,
        id: invoice.id,
        user_id: invoice.user_id,
        status: invoice.status,
      };

      reset(newInvoice);
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

  const onSubmit = (status: Enums<"status">) => setValue("status", status);

  const onFinish = async (formData: Asserts<typeof invoiceSchema>) => {
    try {
      const newInvoice = {
        sender_street: formData.sender_street,
        sender_city: formData.sender_city,
        sender_postcode: formData.sender_postcode,
        sender_country: formData.sender_country,
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_street: formData.client_street,
        client_city: formData.client_city,
        client_country: formData.client_country,
        client_postcode: formData.client_postcode,
        payment_due: formData.payment_due,
        payment_terms: formData.payment_terms,
        description: formData.description,
        status: formData.status,
        user_id: identity?.id,
        items: formData.items,
        id: formData.id,
      };
      updateInvoice(newInvoice);

      open?.({
        description: `Invoice updated${
          formData.status === "draft" ? "" : " and sent"
        }`,
        message: "success",
        type: "success",
      });

      close();
      reset();
    } catch (error) {
      console.error("One of the mutations failed", error);
    }
  };

  return {
    invoicesEditModalForm,
    itemsFieldArray,
    onFinish,
    onSubmit,
  };
};

export default useInvoicesEditModalForm;
