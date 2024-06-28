import { useEffect, useState } from "react";
import { useModalForm } from "@refinedev/react-hook-form";
import { useFieldArray } from "react-hook-form";
import { formatDate } from "date-fns";
import {
  useCreate,
  useCreateMany,
  HttpError,
  useNotification,
  useNavigation,
  useGetIdentity,
  useCustom,
} from "@refinedev/core";
import { Status } from "~/types/invoices";
import { yupResolver } from "@hookform/resolvers/yup";
import { invoiceSchema } from "~/constants";
import { InferType } from "yup";
import { supabaseClient } from "~/utility";
import {
  FunctionsHttpError,
  FunctionsRelayError,
  FunctionsFetchError,
} from "@supabase/supabase-js";

/**
 * Custom hook for creating a new invoice.
 * @returns An object containing the form state and related functions.
 */
const useInvoicesCreateModalForm = () => {
  let newInvoice;
  const [_, setIsSubmitting] = useState(false);
  const { mutateAsync } = useCreate();
  const { show } = useNavigation();
  const { mutateAsync: mutateManyAsync } = useCreateMany();
  const { data: identity, isLoading: isIdentityLoading } = useGetIdentity<{
    id: string;
  }>();
  const invoicesCreateModalForm = useModalForm<
    InferType<typeof invoiceSchema>,
    HttpError,
    InferType<typeof invoiceSchema>
  >({
    resolver: yupResolver(invoiceSchema),
    refineCoreProps: {
      resource: "invoices",
      action: "create",
    },
    defaultValues: {
      client_city: "",
      client_country: "",
      client_email: "",
      client_name: "",
      client_postcode: "",
      client_street: "",
      description: "",
      payment_due: formatDate(new Date(), "yyyy-MM-dd"),
      payment_terms: "30",
      status: "pending",
      sender_city: "",
      sender_country: "",
      sender_postcode: "",
      sender_street: "",
      user_id: identity?.id,
      items: [{ name: "", quantity: 1, price: 0 }],
    },
  });
  const {
    control,

    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = invoicesCreateModalForm;

  useEffect(() => {
    if (!isIdentityLoading && identity) {
      setValue("user_id", identity.id);
    }
  }, [identity]);

  const { open } = useNotification();
  const itemsFieldArray = useFieldArray<InferType<typeof invoiceSchema>>({
    control,
    name: "items",
  });
  const items = watch("items");

  const status = watch("status");

  const onSubmit = (status: Status) =>
    status === "draft" ? setValue("status", status) : handleSubmit(onFinish)();

  useEffect(() => {
    if (status && isDirty) handleSubmit(onFinish)();
  }, [status]);

  const onFinish = async (formData: InferType<typeof invoiceSchema>) => {
    console.log("formData", formData);
    setIsSubmitting(true);
    try {
      newInvoice = {
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
      const invoice = await mutateAsync({
        resource: "invoices",
        values: newInvoice,
        successNotification: false,
      });
      await mutateManyAsync({
        resource: "items",
        values: items.map((item) => ({
          invoice_id: invoice.data.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          user_id: identity?.id,
        })),
        successNotification: false,
      });
      if (formData.status === "pending") {
        const { data, error } = await supabaseClient.functions.invoke(
          "send-invoice",
          {
            body: {
              ...newInvoice,
              items,
              id: invoice.data.id,
            },
          }
        );
        if (error instanceof FunctionsHttpError) {
          const errorMessage = await error.context.json();
          console.log("Function returned an error", errorMessage);
        } else if (error instanceof FunctionsRelayError) {
          console.log("Relay error:", error.message);
        } else if (error instanceof FunctionsFetchError) {
          console.log("Fetch error:", error.message);
        }
      }

      open?.({
        description: `Invoice successfully ${
          formData.status === "draft" ? "drafted" : "saved and sent"
        }.`,
        message: "success",
        type: "success",
      });
      show("invoices", invoice.data.id!);
      setIsSubmitting(false);
    } catch (error) {
      open?.({
        description: "Sorry, something went wrong. Please try again.",
        message: "error",
        type: "error",
      });
    }
  };

  return {
    invoicesCreateModalForm,
    itemsFieldArray,
    onFinish,
    onSubmit,
  };
};

export default useInvoicesCreateModalForm;
