import {
  HttpError,
  useCreate,
  useDelete,
  useDeleteMany,
  useNavigation,
  useNotification,
  useUpdate,
} from "@refinedev/core";
import { useModalForm } from "@refinedev/react-hook-form";
import { formatDate } from "date-fns";
import { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { InvoiceWithRelated, InvoiceDto, Item, Status } from "~/types/invoices";
import { Tables } from "~/types/supabase";

const useInvoicesEditModalForm = (
  invoice: InvoiceWithRelated,
  isInvoicesLoading: boolean
) => {
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
    refineCoreProps: { autoSave: { enabled: true } },
    syncWithLocation: true,
  });
  const { list } = useNavigation();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isInvoicesLoading && invoice) {
      reset({
        senderStreet: invoice.senderAddress.street,
        senderCity: invoice.senderAddress.city,
        senderPostCode: invoice.senderAddress.postCode,
        senderCountry: invoice.senderAddress.country,
        clientName: invoice.client.name,
        clientEmail: invoice.client.email,
        clientStreet: invoice.clientAddress.street,
        clientCity: invoice.clientAddress.city,
        clientPostCode: invoice.clientAddress.postCode,
        clientCountry: invoice.clientAddress.country,
        paymentDue: formatDate(new Date(), "yyyy-MM-dd"),
        paymentTerms: "30",
        description: invoice.description,
        items: invoice.items,
      });
    }
  }, [invoice]);

  const { mutateAsync: mutateDeleteAsync } = useDelete();
  const { mutateAsync: mutateDeleteManyAsync } = useDeleteMany();
  const { mutateAsync: mutateCreateAsync } = useCreate();
  const { mutateAsync: mutateUpdateAsync } = useUpdate();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const { open } = useNotification();

  const onSubmit = (status: Status) => {
    setValue("status", status);
    handleSubmit(onFinishHandler);
  };

  const onUpdateStatus = (status: "paid" | "pending") => {
    mutateUpdateAsync(
      {
        resource: "invoices",
        id: invoice?.id,
        values: {
          status,
        },
      },
      {
        onError: (error) => error,
        onSuccess: () => {
          if (open)
            open({
              type: "success",
              message: `Invoice marked as ${status}`,
            });
        },
      }
    );
  };

  const onDeleteHandler = async () => {
    try {
      await Promise.all([
        mutateDeleteManyAsync({
          resource: "items",
          ids: invoice?.items.map((item) => item.id),
        }),
        mutateDeleteAsync({
          resource: "invoices",
          id: invoice?.id,
        }),
        mutateDeleteAsync({
          resource: "addresses",
          id: invoice?.clientAddressId,
        }),
        mutateDeleteAsync({
          resource: "addresses",
          id: invoice?.senderAddressId,
        }),
      ]);
      list("invoices");
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const onFinishHandler = async (formData: InvoiceDto) => {
    setIsSubmitting(true);
    const newItems = formData.items.filter((item) => !item.id);
    const deletedItems = invoice?.items.filter((item: Item) => {
      return !formData.items.some((newItem) => newItem.id === item.id);
    });
    const updatedItems = formData.items.filter((item) => item.id) as Array<
      Tables<"items">
    >;

    try {
      const responseData = await Promise.all([
        mutateUpdateAsync({
          resource: "clients",
          id: invoice?.clientId,
          values: {
            name: formData.clientName,
            email: formData.clientEmail,
          },
        }),
        mutateUpdateAsync({
          resource: "addresses",
          id: invoice?.senderAddressId,
          values: {
            street: formData.senderStreet,
            city: formData.senderCity,
            postCode: formData.senderPostCode,
            country: formData.senderCountry,
          },
        }),
        mutateUpdateAsync({
          resource: "addresses",
          id: invoice?.clientAddressId,
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
        status: "draft",
        total: items!.reduce(
          (acc: number, item) => acc + item.quantity * item.price,
          0
        ),
      };

      await mutateUpdateAsync({
        resource: "invoices",
        id: invoice?.id,
        values: newInvoice,
      });

      await Promise.all([
        ...updatedItems.map((item) =>
          mutateUpdateAsync({
            resource: "items",
            id: item.id,
            values: {
              invoiceId: invoice?.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              total: item.quantity * item.price,
            },
          })
        ),
        ...newItems.map((item) =>
          mutateCreateAsync({
            resource: "items",
            values: {
              invoiceId: invoice?.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              total: item.quantity * item.price,
            },
          })
        ),
        ...deletedItems.map((item) =>
          mutateDeleteAsync({
            resource: "items",
            id: item.id,
          })
        ),
      ]);

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
    handleSubmit,
    errors,
    register,
    fields,
    append,
    remove,
    items,
    isSubmitting,
    setShowConfirmationModal,
    showConfirmationModal,
    onSubmit,
    onUpdateStatus,
    onDeleteHandler,
    onFinishHandler,
  };
};

export default useInvoicesEditModalForm;
