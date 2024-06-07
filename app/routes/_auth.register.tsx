import { AuthPage, useLogin, useRegister } from "@refinedev/core";
import { Link } from "@remix-run/react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import Icon from "~/components/icon";
import { useForm } from "react-hook-form";

type RegisterFormData = {
  email: string;
  password: string;
};

export default function Register() {
  const { mutate: mutateRegister, isLoading: isRegisterLoading } =
    useRegister();
  const { mutate: mutateLogin, isLoading: isLoginLoading } = useLogin();
  const { handleSubmit, register } = useForm<RegisterFormData>();

  const onSubmit = (data: RegisterFormData) =>
    mutateRegister(data, {
      onSuccess: () => mutateLogin(data),
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
              Register
            </Card.Title>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control
                  id="email"
                  type="email"
                  {...register("email", { required: true })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="password">Password</Form.Label>
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
                disabled={isRegisterLoading || isLoginLoading}
              >
                {isRegisterLoading || isLoginLoading
                  ? "Registering..."
                  : "Register"}
              </Button>
              <Link to="/login" className="d-block mt-3 text-center">
                Already have an account? Login
              </Link>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
