import { useLogin } from "@refinedev/core";
import { Link } from "@remix-run/react";
import { Alert, Button, Form, Stack } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import { credentialsSchema } from "~/constants/schemas";
import AuthLayout from "~/components/auth-layout";
import type { InferType } from "yup";
import { useForm } from "@refinedev/react-hook-form";
import { FormProvider } from "react-hook-form";
import Field from "~/components/field";
import { useState } from "react";

export default function Login() {
  const { mutate, isPending: isLoading } = useLogin();
  const [demoError, setDemoError] = useState<string | null>(null);
  const methods = useForm<InferType<typeof credentialsSchema>>({
    resolver: yupResolver(credentialsSchema),
  });
  const { handleSubmit } = methods;

  const onSubmit = (data: InferType<typeof credentialsSchema>) => mutate(data);

  return (
    <AuthLayout title="Login">
      <Button
        variant="secondary"
        type="button"
        className="w-100 mb-3"
        disabled={isLoading}
        onClick={() => {
          setDemoError(null);
          mutate({}, {
            onError: (error) =>
              setDemoError(error.message ?? "Demo login failed"),
          });
        }}
      >
        {isLoading ? "Opening demo..." : "Try the demo"}
      </Button>
      {demoError && <Alert variant="danger" className="mb-3">{demoError}</Alert>}
      <div className="d-flex align-items-center gap-2 mb-3">
        <hr className="flex-grow-1" />
        <span className="small text-body-secondary">or login</span>
        <hr className="flex-grow-1" />
      </div>
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
