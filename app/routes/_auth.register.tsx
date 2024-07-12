import { useNotification, useRegister } from "@refinedev/core";
import { Link } from "@remix-run/react";
import { Button, Form, Stack } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { newCredentialsSchema } from "~/constants";
import AuthLayout from "~/components/auth-layout";
import { InferType } from "yup";
import Field from "~/components/field";

export default function Register() {
  const { mutate: mutateRegister, isLoading: isRegisterLoading } =
    useRegister();
  const methods = useForm<InferType<typeof newCredentialsSchema>>({
    resolver: yupResolver(newCredentialsSchema),
  });
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = methods;
  const { open } = useNotification();

  const onSubmit = (data: InferType<typeof newCredentialsSchema>) =>
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
        <Stack direction="vertical" gap={3} className="mb-3">
          <Field
            name="email"
            type="email"
            label="Email"
            control={control}
            register={register}
            errors={errors}
          />
          <Field
            name="password"
            type="password"
            label="Password"
            control={control}
            register={register}
            errors={errors}
          />
        </Stack>
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
