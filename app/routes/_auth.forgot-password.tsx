import { yupResolver } from "@hookform/resolvers/yup";
import { useForgotPassword, useNotification } from "@refinedev/core";
import { Link } from "@remix-run/react";
import { Button, Form, Stack } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import { InferType } from "yup";
import AuthLayout from "~/components/auth-layout";
import Field from "~/components/field";
import { credentialsSchema } from "~/constants";

export default function ForgotPassword() {
  const methods = useForm<InferType<typeof credentialsSchema>>({
    resolver: yupResolver(credentialsSchema.omit(["password", "rememberMe"])),
  });
  const { handleSubmit } = methods;
  const { mutate, isLoading } = useForgotPassword();
  const { open } = useNotification();

  const onSubmit = (data: InferType<typeof credentialsSchema>) =>
    mutate(data, {
      onSuccess: (data) => {
        if (!data.success) return;
        open?.({
          type: "success",
          message: "success",
          description: "Instructions sent to your email",
        });
      },
    });

  return (
    <AuthLayout title="Forgot Password">
      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="vertical" gap={3} className="mb-3">
            <Field name="email" type="email" label="Email" />
          </Stack>
          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Instructions"}
          </Button>
          <Link to="/login" className="d-block mt-3 text-center">
            Already have an account? Login
          </Link>
        </Form>
      </FormProvider>
    </AuthLayout>
  );
}
