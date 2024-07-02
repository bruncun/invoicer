import { yupResolver } from "@hookform/resolvers/yup";
import {
  BaseKey,
  HttpError,
  useCreate,
  useDelete,
  useGetIdentity,
  useNotification,
  useUpdate,
} from "@refinedev/core";
import { useModalForm } from "@refinedev/react-hook-form";
import { parseISO, formatDate, sub } from "date-fns";
import { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { Asserts, InferType } from "yup";
import { invoiceSchema } from "~/constants";
import { Status } from "~/types/invoices";
import { Tables } from "~/types/supabase";

const useInvoicesEditModalForm = (
  isInvoicesLoading: boolean,
  invoice?: Tables<"invoices"> & { items: Tables<"items">[] }
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: identity, isLoading: isIdentityLoading } = useGetIdentity<{
    id: string;
  }>();

  const invoicesEditModalForm = useModalForm<
    InferType<typeof invoiceSchema>,
    HttpError,
    InferType<typeof invoiceSchema>
  >({
    syncWithLocation: true,
    refineCoreProps: {
      resource: "invoices",
      action: "edit",
    },
    resolver: yupResolver(invoiceSchema),
  });
  const {
    control,
    reset,
    modal: { visible, close, show: modalShow },
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    register,
    getValues,
    refineCore: { onFinish },
    setValue,
  } = invoicesEditModalForm;
  const { open } = useNotification();

  useEffect(() => {
    if (!isIdentityLoading && identity) {
      setValue("user_id", identity.id);
    }
  }, [identity]);

  const itemsFieldArray = useFieldArray<InferType<typeof invoiceSchema>>({
    control,
    name: "items",
  });
  const invoiceDate = watch("invoice_date") ?? "";
  console.log("invoiceDate", invoiceDate);

  const { mutateAsync: mutateDeleteAsync } = useDelete();
  const { mutateAsync: mutateCreateAsync } = useCreate();
  const { mutateAsync: mutateUpdateAsync } = useUpdate();

  const status = watch("status");

  useEffect(() => {
    if (!isInvoicesLoading && invoice) {
      const invoice_date = sub(parseISO(invoice.payment_due), {
        days: parseInt(invoice.payment_terms),
      });
      const formatted_invoice_date = formatDate(invoice_date, "yyyy-MM-dd");
      setValue("invoice_date", formatted_invoice_date);

      const newInvoice = {
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
        payment_terms: "30",
        invoice_date: formatted_invoice_date,
        description: invoice.description,
        items: invoice.items,
        user_id: invoice.user_id,
      };

      console.log(newInvoice);
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

  const onSubmit = (status: Status) => setValue("status", status);

  useEffect(() => {
    if (status && isDirty) handleSubmit(onFinishHandler)();
  }, [status]);

  const onFinishHandler = async (formData: Asserts<typeof invoiceSchema>) => {
    setIsSubmitting(true);
    const newItems = formData.items.filter((item) => !item.id);
    const deletedItems =
      invoice?.items.filter((item: Tables<"items">) => {
        return !formData.items.some((newItem) => newItem.id === item.id);
      }) ?? [];
    const updatedItems = formData.items.filter((item) => item.id) as Array<
      Tables<"items">
    >;

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
        payment_terms: parseInt(formData.payment_terms),
        description: formData.description,
        status: formData.status,
        user_id: identity?.id,
      };

      await Promise.all([
        ...updatedItems.map((item) =>
          mutateUpdateAsync({
            resource: "items",
            id: item.id,
            values: {
              invoice_id: invoice?.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              user_id: identity?.id,
            },
            successNotification: false,
          })
        ),
        ...newItems.map((item) =>
          mutateCreateAsync({
            resource: "items",
            values: {
              invoice_id: invoice?.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              user_id: identity?.id,
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
          id: invoice?.id as BaseKey,
          values: newInvoice,
          successNotification: false,
        }),
      ]);
      open?.({
        description: `Invoice updated${
          formData.status === "draft" ? "" : " and sent"
        }`,
        message: "success",
        type: "success",
      });

      close();
      reset();
      setIsSubmitting(false);
    } catch (error) {
      console.error("One of the mutations failed", error);
    }
  };

  return {
    invoicesEditModalForm,
    itemsFieldArray,
    onFinish: onFinishHandler,
    onSubmit,
  };
};

export default useInvoicesEditModalForm;
