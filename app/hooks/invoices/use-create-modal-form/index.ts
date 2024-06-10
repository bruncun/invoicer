import { useState } from "react";
import { useModalForm } from "@refinedev/react-hook-form";
import { useFieldArray } from "react-hook-form";
import { formatDate } from "date-fns";
import {
  useCreate,
  useCreateMany,
  HttpError,
  useNotification,
  useNavigation,
  useGo,
  useGetIdentity,
  useSelect,
} from "@refinedev/core";
import { InvoiceDto, Status } from "~/types/invoices";

const useInvoicesCreateModalForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync } = useCreate();
  const { show } = useNavigation();
  const { mutateAsync: mutateManyAsync } = useCreateMany();
  const { data: identity } = useGetIdentity<{ id: string }>();
  const {
    control,
    reset,
    modal: { visible, close, show: modalShow },
    handleSubmit,
    formState: { errors },
    watch,
    register,
    setValue,
  } = useModalForm<InvoiceDto, HttpError, InvoiceDto>({
    refineCoreProps: {
      action: "create",
    },
    defaultValues: {
      senderStreet: "",
      senderCity: "",
      senderPostCode: "",
      senderCountry: "",
      clientName: "",
      clientEmail: "",
      clientStreet: "",
      clientCity: "",
      clientPostCode: "",
      clientCountry: "",
      payment_due: formatDate(new Date(), "yyyy-MM-dd"),
      payment_terms: "30",
      description: "",
      status: "pending",
      items: [{ name: "", quantity: 1, price: 0 }],
    },
  });
  const { open } = useNotification();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");

  const onSubmit = (status: Status) => {
    setValue("status", status);
    handleSubmit(onFinish)();
  };

  const onFinish = async (formData: InvoiceDto) => {
    setIsSubmitting(true);
    try {
      const client = await mutateAsync({
        resource: "clients",
        values: {
          name: formData.clientName,
          email: formData.clientEmail,
          user_id: identity?.id,
        },
        successNotification: false,
      });
      const responseData = await Promise.all([
        mutateAsync({
          resource: "addresses",
          values: {
            street: formData.senderStreet,
            city: formData.senderCity,
            postCode: formData.senderPostCode,
            country: formData.senderCountry,
            user_id: identity?.id,
          },
          successNotification: false,
        }),
        mutateAsync({
          resource: "addresses",
          values: {
            street: formData.clientStreet,
            city: formData.clientCity,
            postCode: formData.clientPostCode,
            country: formData.clientCountry,
            user_id: identity?.id,
            client_id: client.data.id,
          },
          successNotification: false,
        }),
      ]);

      const newInvoice = {
        client_id: client.data.id,
        sender_address_id: responseData[0].data.id,
        client_address_id: responseData[1].data.id,
        payment_due: formData.payment_due,
        payment_terms: parseInt(formData.payment_terms),
        description: formData.description,
        status: formData.status,
        total: items.reduce(
          (acc: number, item) => acc + item.quantity * item.price,
          0
        ),
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
          invoiceId: invoice.data.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price,
          user_id: identity?.id,
        })),
        successNotification: false,
      });
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
    modalShow,
    close,
    visible,
    errors,
    register,
    handleSubmit,
    onSubmit,
    onFinish,
    items,
    fields,
    append,
    remove,
    reset,
    isSubmitting,
  };
};

export default useInvoicesCreateModalForm;
