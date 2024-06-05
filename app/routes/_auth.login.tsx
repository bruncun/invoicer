import { AuthPage, useLogin } from "@refinedev/core";
import { Link } from "@remix-run/react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Icon } from "~/components/icon";
import { useForm } from "react-hook-form";

type LoginFormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export default function Login() {
  const { mutate, isLoading } = useLogin();
  const { handleSubmit, register } = useForm<LoginFormData>();

  const onSubmit = (data: LoginFormData) => {
    mutate(data);
  };

  return (
    <Row className="vh-100 align-items-center">
      <Col lg={{ span: 4 }} className="mx-auto">
        <Card className="shadow rounded-4 rounded">
          <Card.Body className="p-4">
            <div className="mb-4 d-flex align-items-center">
              <Icon name="receipt-cutoff" className="fs-1 text-primary"></Icon>
            </div>
            <Card.Title className="fs-4 fs-lg-3 mb-3 d-block lh-1">
              Login
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
              <div className="d-flex justify-content-between">
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Remember me"
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
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
