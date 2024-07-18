import { HttpError } from "@refinedev/core";
import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import { FormProvider } from "react-hook-form";
import { InferType } from "yup";
import { invoiceSchema } from "~/constants";
import { ReactNode } from "react";
import useSyncStatus from "~/hooks/invoices/use-sync-status";
import useSyncPaymentDue from "~/hooks/invoices/use-sync-payment-due";
import { UseGetIdentityReturnType } from "@refinedev/core/dist/hooks/auth/useGetIdentity";
import useSyncUserId from "~/hooks/invoices/use-sync-user-id";
import BillFromSection from "./bill-from-section";
import BillToSection from "./bill-to-section";
import ItemListSection from "./items-list-section";
import SlideOver from "~/components/slide-over";
import InvoicesModalFooter from "./footer";

type InvoicesModalFormProps = {
  title: ReactNode;
  identity: UseGetIdentityReturnType<{
    id: string;
  }>;
  invoicesModalForm: UseModalFormReturnType<
    InferType<typeof invoiceSchema>,
    HttpError,
    InferType<typeof invoiceSchema>
  >;
  onFinish: (formData: InferType<typeof invoiceSchema>) => Promise<void>;
};

const InvoicesModalForm = ({
  onFinish,
  identity,
  title,
  invoicesModalForm,
}: InvoicesModalFormProps) => {
  invoicesModalForm;
  const {
    modal: { visible, close },
    handleSubmit,
    watch,
    setValue,
    getValues,
  } = invoicesModalForm;

  useSyncUserId(setValue, identity);
  useSyncStatus(invoicesModalForm, onFinish);
  useSyncPaymentDue(watch, setValue, getValues);

  return (
    <SlideOver
      title={title}
      visible={visible}
      close={close}
      body={
        <FormProvider {...invoicesModalForm}>
          <form id="invoice-form" onSubmit={handleSubmit(onFinish)}>
            <BillFromSection />
            <BillToSection />
            <ItemListSection />
          </form>
        </FormProvider>
      }
      footer={
        <InvoicesModalFooter
          onFinish={onFinish}
          invoicesModalForm={invoicesModalForm}
        />
      }
    />
  );
};

export default InvoicesModalForm;
