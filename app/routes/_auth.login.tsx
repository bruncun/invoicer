import { useLogin } from "@refinedev/core";
import { Link } from "@remix-run/react";
import { Button, Form } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { credentialsSchema } from "~/constants";
import AuthLayout from "~/components/auth-layout";
import DatePicker from "~/components/date-picker";
import { Children, createElement } from "react";

type LoginFormData = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export default function Login() {
  const { mutate, isLoading } = useLogin();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(credentialsSchema),
  });

  const onSubmit = (data: LoginFormData) => mutate(data);

  return (
    <AuthLayout title="Login">
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
        <Form.Group className="mb-3">
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            id="password"
            type="password"
            isInvalid={!!errors.password}
            {...register("password", {
              required: "This field is required",
            })}
          />
          <Form.Control.Feedback type="invalid">
            {(errors as any)?.password?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <div className="d-flex justify-content-between">
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Remember me"
              id="rememberMe"
              {...register("rememberMe")}
            />
          </Form.Group>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
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
    </AuthLayout>
  );
}
