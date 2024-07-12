import { useNotification, useUpdatePassword } from "@refinedev/core";
import { Button, Form } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import { credentialsSchema } from "~/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthLayout from "~/components/auth-layout";
import { InferType } from "yup";
import Field from "~/components/field";

export default function UpdatePassword() {
  const methods = useForm<InferType<typeof credentialsSchema>>({
    resolver: yupResolver(credentialsSchema.omit(["email"])),
  });
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = methods;
  const { mutate, isLoading } = useUpdatePassword();
  const { open } = useNotification();

  const onSubmit = async (data: InferType<typeof credentialsSchema>) =>
    mutate(data, {
      onSuccess: (data) => {
        if (!data.success) return;
        open?.({
          type: "success",
          message: "success",
          description: "Password updated. Login with your new password.",
        });
      },
    });

  return (
    <AuthLayout title="Update Password">
      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Field
            name="currentPassword"
            type="password"
            label="Current Password"
            control={control}
            register={register}
            errors={errors}
            className="mb-3"
          />
          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </Form>
      </FormProvider>
    </AuthLayout>
  );
}
