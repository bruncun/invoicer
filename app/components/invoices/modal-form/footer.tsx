import { HttpError } from "@refinedev/core";
import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import { Button } from "react-bootstrap";
import type { InferType } from "yup";
import { invoiceSchema } from "~/constants/schemas";

type InvoicesModalFooterProps = {
  invoicesModalForm: UseModalFormReturnType<
    InferType<typeof invoiceSchema>,
    HttpError,
    InferType<typeof invoiceSchema>
  > & {
    onFinish: (formData: InferType<typeof invoiceSchema>) => Promise<void>;
  };
};

const InvoicesModalFooter = ({
  invoicesModalForm,
}: InvoicesModalFooterProps) => {
  const {
    modal: { close },
    onFinish,
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = invoicesModalForm;
  const status = getValues("status");

  const onSaveAsDraft = () => {
    if (status !== "draft") {
      setValue("status", "draft", { shouldDirty: true });
    }
    handleSubmit(onFinish)();
  };

  const onSubmit = () => {
    if (status !== "pending") {
      setValue("status", "pending", { shouldDirty: true });
    }
    handleSubmit(onFinish)();
  };

  return (
    <div className="justify-content-between d-flex m-0 w-100">
      <Button variant="link" onClick={close} className="ms-0 my-0 me-2">
        Cancel
      </Button>
      <div className="hstack gap-2 m-0">
        <Button
          variant="secondary"
          type="button"
          onClick={onSaveAsDraft}
          disabled={isSubmitting}
        >
          {isSubmitting && status === "draft" ? (
            "Saving"
          ) : (
            <>
              Save
              <span className="d-none d-md-inline-block">&nbsp;as Draft</span>
            </>
          )}
        </Button>
        <Button
          variant="primary"
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting && status === "pending" ? "Sending..." : "Save & Send"}
        </Button>
      </div>
    </div>
  );
};

export default InvoicesModalFooter;
