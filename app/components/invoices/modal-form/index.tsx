import { HttpError } from "@refinedev/core";
import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import { FormProvider } from "react-hook-form";
import { InferType } from "yup";
import { invoiceSchema } from "~/constants";
import { ReactNode } from "react";
import useSyncStatus from "~/hooks/invoices/use-sync-status";
import useSyncPaymentDue from "~/hooks/invoices/use-sync-payment-due";
import { useGetIdentity } from "@refinedev/core";
import useSyncUserId from "~/hooks/invoices/use-sync-user-id";
import BillFromSection from "./bill-from-section";
import BillToSection from "./bill-to-section";
import ItemListSection from "./items-list-section";
import SlideOver from "~/components/slide-over";
import InvoicesModalFooter from "./footer";

type InvoicesModalFormProps = {
  title: ReactNode;
  invoicesModalForm: UseModalFormReturnType<
    InferType<typeof invoiceSchema>,
    HttpError,
    InferType<typeof invoiceSchema>
  > & {
    onFinish: (formData: InferType<typeof invoiceSchema>) => Promise<void>;
  };
};

const InvoicesModalForm = ({
  title,
  invoicesModalForm,
}: InvoicesModalFormProps) => {
  const identity = useGetIdentity<{
    id: string;
  }>();
  const {
    modal: { visible, close },
    handleSubmit,
    watch,
    setValue,
    getValues,
    onFinish,
  } = invoicesModalForm;

  useSyncUserId(setValue, identity);
  useSyncStatus(invoicesModalForm, onFinish);
  useSyncPaymentDue(watch, setValue, getValues);

  return (
    <FormProvider {...invoicesModalForm}>
      <SlideOver
        title={title}
        visible={visible}
        close={close}
        body={
          <form id="invoice-form" onSubmit={handleSubmit(onFinish)}>
            <BillFromSection />
            <BillToSection />
            <ItemListSection />
          </form>
        }
        footer={<InvoicesModalFooter invoicesModalForm={invoicesModalForm} />}
      />
    </FormProvider>
  );
};

export default InvoicesModalForm;
