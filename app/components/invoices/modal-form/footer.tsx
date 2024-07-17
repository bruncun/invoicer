import { HttpError } from "@refinedev/core";
import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import { Button, Stack } from "react-bootstrap";
import { InferType } from "yup";
import { invoiceSchema } from "~/constants";
import { Enums } from "~/types/supabase";

type InvoicesModalFooterProps = {
  invoicesCreateModalForm: UseModalFormReturnType<
    InferType<typeof invoiceSchema>,
    HttpError,
    InferType<typeof invoiceSchema>
  >;
  onFinish: (formData: InferType<typeof invoiceSchema>) => Promise<void>;
};

const InvoicesModalFooter = ({
  onFinish,
  invoicesCreateModalForm,
}: InvoicesModalFooterProps) => {
  const methods = invoicesCreateModalForm;
  const {
    modal: { close },
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting, isValid },
  } = methods;
  const { status } = getValues();

  const onSubmit = (status: Enums<"status">) =>
    status === "draft" && isValid
      ? setValue("status", status)
      : handleSubmit(onFinish)();

  return (
    <div className="justify-content-between d-flex m-0 w-100">
      <Button variant="link" onClick={close} className="ms-0 my-0 me-2">
        Cancel
      </Button>
      <Stack direction="horizontal" gap={2} className="m-0">
        <Button
          variant="secondary"
          form="invoice-form"
          onClick={() => onSubmit("draft")}
          disabled={isSubmitting}
        >
          {isSubmitting && status === "draft" ? (
            "Saving"
          ) : (
            <>
              Save
              <span className="d-none d-sm-inline-block">&nbsp;as Draft</span>
            </>
          )}
        </Button>
        <Button
          variant="primary"
          form="invoice-form"
          onClick={() => onSubmit("pending")}
          disabled={isSubmitting}
        >
          {isSubmitting && status === "pending" ? "Sending..." : "Save & Send"}
        </Button>
      </Stack>
    </div>
  );
};

export default InvoicesModalFooter;
