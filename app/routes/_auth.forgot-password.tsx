import {
  AuthPage,
  useLogin,
  useForgotPassword,
  useNotification,
} from "@refinedev/core";
import { Link } from "@remix-run/react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import Icon from "~/components/icon";
import { useForm } from "react-hook-form";
import { supabaseClient } from "~/utility";
import { useState } from "react";

type ForgotPasswordFormData = {
  email: string;
};

export default function ForgotPassword() {
  const { handleSubmit, register } = useForm<ForgotPasswordFormData>();
  const { mutate, isLoading } = useForgotPassword();
  const { open } = useNotification();

  const onSubmit = (data: ForgotPasswordFormData) =>
    mutate(data, {
      onSuccess: () => {
        open?.({
          type: "success",
          message: "Instructions sent to your email.",
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
              Forgot Password
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
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
