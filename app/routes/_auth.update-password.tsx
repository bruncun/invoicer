import { useNotification, useUpdatePassword } from "@refinedev/core";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import Icon from "~/components/icon";
import { useForm } from "react-hook-form";

type UpdatePasswordFormData = {
  password: string;
};

export default function UpdatePassword() {
  const { handleSubmit, register } = useForm<UpdatePasswordFormData>();
  const { mutate, isLoading } = useUpdatePassword();
  const { open } = useNotification();

  const onSubmit = async (data: UpdatePasswordFormData) =>
    mutate(data, {
      onSuccess: () => {
        open?.({
          type: "success",
          message: "Password updated.",
        });
      },
    });

  return (
    <Row className="vh-100 align-items-center">
      <Col lg={{ span: 4 }} className="mx-auto">
        <Card className="shadow rounded-4 rounded">
          <Card.Body className="p-4">
            <div className="mb-4 d-flex align-items-center">
              <Icon name="receipt-cutoff" className="fs-1 text-primary"></Icon>
            </div>
            <Card.Title className="fs-4 fs-lg-3 mb-3 d-block lh-1">
              Update Password
            </Card.Title>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="password">New Password</Form.Label>
                <Form.Control
                  id="password"
                  type="password"
                  {...register("password", { required: true })}
                />
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
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
