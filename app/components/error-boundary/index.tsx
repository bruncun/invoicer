import {
  useRouteError,
  ErrorResponse,
  Meta,
  Links,
  Scripts,
} from "@remix-run/react";
import { Row, Col, Button } from "react-bootstrap";
import useTheme from "~/hooks/use-theme";
import Icon from "../icon";

export function ErrorBoundary() {
  const error = useRouteError() as ErrorResponse;
  useTheme();

  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div
          className="position-absolute top-50 start-50 translate-middle w-100"
          data-testid="loading"
        >
          <Row>
            <Col xs={{ span: 6, offset: 3 }} className="text-center">
              <div>
                <span className="h6 mb-3 text-primary d-block">
                  {error.status}
                </span>
                <span className="h4 mb-5 d-block">{error.statusText}</span>
                <Button
                  onClick={() => {
                    window.history.back();
                  }}
                >
                  <Icon name="chevron-left" className="me-2"></Icon>
                  Go back
                </Button>
              </div>
            </Col>
          </Row>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
