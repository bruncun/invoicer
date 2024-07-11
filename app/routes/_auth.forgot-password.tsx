import { yupResolver } from "@hookform/resolvers/yup";
import { useForgotPassword, useNotification } from "@refinedev/core";
import { Link } from "@remix-run/react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import AuthLayout from "~/components/auth-layout";
import { credentialsSchema } from "~/constants";

type ForgotPasswordFormData = {
  email: string;
};

export default function ForgotPassword() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(credentialsSchema.omit(["password"])),
  });
  const { mutate, isLoading } = useForgotPassword();
  const { open } = useNotification();

  const onSubmit = (data: ForgotPasswordFormData) =>
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
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            id="email"
            type="email"
            isInvalid={!!errors.email}
            {...register("email")}
          />
          <Form.Control.Feedback type="invalid">
            {(errors as any)?.email?.message}
          </Form.Control.Feedback>
        </Form.Group>
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
    </AuthLayout>
  );
}
