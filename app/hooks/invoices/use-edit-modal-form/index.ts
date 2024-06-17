import {
  BaseKey,
  BaseRecord,
  HttpError,
  useCreate,
  useDelete,
  useDeleteMany,
  useGetIdentity,
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
  isInvoicesLoading: boolean,
  invoice?: InvoiceWithRelated
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
    refineCoreProps: {
      autoSave: { enabled: true },
    },
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
        payment_due: formatDate(new Date(), "yyyy-MM-dd"),
        payment_terms: "30",
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
  const { data: identity } = useGetIdentity<{ id: string }>();

  const status = watch("status");

  const onSubmit = (status: Status) => setValue("status", status);

  useEffect(() => {
    console.log("effect", status);
    if (status) handleSubmit(onFinish)();
  }, [status]);

  const onUpdateStatus = (status: "paid" | "pending") => {
    mutateUpdateAsync({
      resource: "invoices",
      id: invoice?.id as BaseKey,
      values: {
        status,
      },
      successNotification: {
        type: "success",
        message: "success",
        description: `Invoice marked as ${status}`,
      },
    });
  };

  const onDelete = async () => {
    try {
      await Promise.all([
        mutateDeleteManyAsync({
          resource: "items",
          ids: invoice?.items.map((item) => item.id) as Array<BaseKey>,
          successNotification: false,
        }),
        mutateDeleteAsync({
          resource: "invoices",
          id: invoice?.id as BaseKey,
          successNotification: false,
        }),
      ]);
      open?.({
        description: "Invoice deleted",
        message: "success",
        type: "success",
      });
      list("invoices");
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const onFinish = async (formData: InvoiceDto) => {
    console.log("finish");
    setIsSubmitting(true);
    const newItems = formData.items.filter((item) => !item.id);
    const deletedItems =
      invoice?.items.filter((item: Item) => {
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
        description: `Invoice successfully updated${
          formData.status === "draft" ? "" : " and sent"
        }.`,
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
    onDelete,
    onFinish,
  };
};

export default useInvoicesEditModalForm;
