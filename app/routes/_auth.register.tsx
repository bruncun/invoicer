import { useNotification, useRegister } from "@refinedev/core";
import { Link } from "@remix-run/react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { credentialsSchema } from "~/constants";
import AuthLayout from "~/components/auth-layout";

type RegisterFormData = {
  email: string;
  password: string;
};

export default function Register() {
  const { mutate: mutateRegister, isLoading: isRegisterLoading } =
    useRegister();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(credentialsSchema),
  });
  const { open } = useNotification();

  const onSubmit = (data: RegisterFormData) =>
    mutateRegister(data, {
      onSuccess: (data) => {
        if (!data.success) return;
        open?.({
          type: "success",
          message: "success",
          description: "Account created successfully. You can now login.",
        });
      },
    });

  return (
    <AuthLayout title="Register">
      <Form onSubmit={handleSubmit(onSubmit)}>
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
        <Form.Group className="mb-3">
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            id="password"
            type="password"
            isInvalid={!!errors.password}
            {...register("password")}
          />
          <Form.Control.Feedback type="invalid">
            {(errors as any)?.password?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          className="w-100"
          disabled={isRegisterLoading}
        >
          {isRegisterLoading ? "Registering..." : "Register"}
        </Button>
        <Link to="/login" className="d-block mt-3 text-center">
          Already have an account? Login
        </Link>
      </Form>
    </AuthLayout>
  );
}
