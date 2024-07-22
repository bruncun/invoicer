import { useModalForm } from "@refinedev/react-hook-form";
import { formatDate } from "date-fns";
import { HttpError, useNotification, useNavigation } from "@refinedev/core";
import { yupResolver } from "@hookform/resolvers/yup";
import { invoiceSchema } from "~/constants";
import { InferType } from "yup";
import useInvoiceCreate from "../use-invoice-create";
import { supabaseClient } from "~/utility/supabase";

const useInvoicesCreateModalForm = () => {
  const { createInvoice } = useInvoiceCreate();
  const { show } = useNavigation();
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
      invoice_date: formatDate(new Date(), "yyyy-MM-dd"),
      payment_due: "",
      payment_terms: "30",
      status: "",
      sender_city: "",
      sender_country: "",
      sender_postcode: "",
      sender_street: "",
      user_id: "",
      items: [{ name: "", quantity: 1, price: 0 }],
    },
  });
  const { open } = useNotification();

  const onFinish = async (formData: InferType<typeof invoiceSchema>) => {
    const { invoice_date, ...newInvoice } = formData;
    const isInvoicePending = formData.status === "pending";
    try {
      const invoice = await createInvoice(newInvoice);
      if (isInvoicePending)
        await supabaseClient.functions.invoke("send-invoice", {
          body: {
            ...newInvoice,
            id: invoice.data.id,
          },
        });
      open?.({
        description: `Invoice ${
          isInvoicePending ? "saved and sent" : "created"
        }`,
        message: "success",
        type: "success",
      });
      show("invoices", invoice.data.id!);
    } catch {
      open?.({
        description: "Sorry, something went wrong - please try again",
        message: "error",
        type: "error",
      });
    }
  };

  return {
    ...invoicesCreateModalForm,
    onFinish,
  };
};

export default useInvoicesCreateModalForm;
