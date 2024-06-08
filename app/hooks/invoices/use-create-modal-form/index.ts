import { useState } from "react";
import { useModalForm } from "@refinedev/react-hook-form";
import { useFieldArray } from "react-hook-form";
import { formatDate } from "date-fns";
import { useCreate, useCreateMany, HttpError } from "@refinedev/core";
import { InvoiceDto, Status } from "~/types/invoices";

const useInvoicesCreateModalForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync } = useCreate();
  const { mutateAsync: mutateManyAsync } = useCreateMany();

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
    refineCoreProps: { action: "create", autoSave: { enabled: true } },
    syncWithLocation: true,
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
      paymentDue: formatDate(new Date(), "yyyy-MM-dd"),
      paymentTerms: "30",
      description: "",
      status: "pending",
      items: [{ name: "", quantity: 0, price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");

  const onSubmit = (status: Status) => {
    setValue("status", status);
    handleSubmit(onFinishHandler);
  };

  const onFinishHandler = async (formData: InvoiceDto) => {
    setIsSubmitting(true);
    try {
      const responseData = await Promise.all([
        mutateAsync({
          resource: "clients",
          values: {
            name: formData.clientName,
            email: formData.clientEmail,
          },
        }),
        mutateAsync({
          resource: "addresses",
          values: {
            street: formData.senderStreet,
            city: formData.senderCity,
            postCode: formData.senderPostCode,
            country: formData.senderCountry,
          },
        }),
        mutateAsync({
          resource: "addresses",
          values: {
            street: formData.clientStreet,
            city: formData.clientCity,
            postCode: formData.clientPostCode,
            country: formData.clientCountry,
          },
        }),
      ]);

      const newInvoice = {
        clientId: responseData[0].data.id,
        senderAddressId: responseData[1].data.id,
        clientAddressId: responseData[2].data.id,
        paymentDue: formData.paymentDue,
        paymentTerms: parseInt(formData.paymentTerms),
        description: formData.description,
        status: formData.status,
        total: items.reduce(
          (acc: number, item) => acc + item.quantity * item.price,
          0
        ),
      };
      const invoice = await mutateAsync({
        resource: "invoices",
        values: newInvoice,
      });
      await mutateManyAsync({
        resource: "items",
        values: items.map((item) => ({
          invoiceId: invoice.data.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price,
        })),
      });
      close();
      reset();
      setIsSubmitting(false);
    } catch (error) {
      console.error("One of the mutations failed", error);
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
    onFinishHandler,
    items,
    fields,
    append,
    remove,
    isSubmitting,
  };
};

export default useInvoicesCreateModalForm;
