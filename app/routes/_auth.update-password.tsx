import { useNotification, useUpdatePassword } from "@refinedev/core";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { credentialsSchema } from "~/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthLayout from "~/components/auth-layout";

type UpdatePasswordFormData = {
  password: string;
};

export default function UpdatePassword() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UpdatePasswordFormData>({
    resolver: yupResolver(credentialsSchema.omit(["email"])),
  });
  const { mutate, isLoading } = useUpdatePassword();
  const { open } = useNotification();

  const onSubmit = async (data: UpdatePasswordFormData) =>
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
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="password">New Password</Form.Label>
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
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update"}
        </Button>
      </Form>
    </AuthLayout>
  );
}
