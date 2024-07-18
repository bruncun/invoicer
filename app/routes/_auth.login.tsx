import { useLogin, useNotification } from "@refinedev/core";
import { Link } from "@remix-run/react";
import { Button, Form, Stack } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import { credentialsSchema } from "~/constants";
import AuthLayout from "~/components/auth-layout";
import { InferType } from "yup";
import { useForm } from "@refinedev/react-hook-form";
import { FormProvider } from "react-hook-form";
import Field from "~/components/field";

let i = 0;
export default function Login() {
  const { mutate, isLoading } = useLogin();
  const methods = useForm<InferType<typeof credentialsSchema>>({
    resolver: yupResolver(credentialsSchema),
  });
  const { handleSubmit } = methods;
  const notification = useNotification();

  if (i < 4) {
    notification.open({
      type: "success",
      message: "Welcome back!",
      description: "Please login to continue.",
    });
    i++;
  }
  const onSubmit = (data: InferType<typeof credentialsSchema>) => mutate(data);

  return (
    <AuthLayout title="Login">
      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="vertical" gap={3} className="mb-3">
            <Field name="email" type="email" label="Email" />
            <Field name="password" type="password" label="Password" />
            <div className="d-flex justify-content-between">
              <Field name="remember" type="checkbox" label="Remember me" />
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
          </Stack>
          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          <Link to="/register" className="d-block mt-3 text-center">
            Don't have an account? Register
          </Link>
        </Form>
      </FormProvider>
    </AuthLayout>
  );
}
