import { Card, Col, Row } from "react-bootstrap";
import Icon from "~/components/icon";
import useTheme from "~/hooks/use-theme";

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
};

const AuthLayout = ({ children, title }: AuthLayoutProps) => {
  useTheme();

  return (
    <Row className="vh-100 align-items-center">
      <Col xl={{ span: 4 }} className="mx-auto">
        <Card className="shadow rounded-4 rounded">
          <Card.Body className="p-4">
            <div className="mb-4 d-flex align-items-center">
              <Icon name="receipt-cutoff" className="fs-1 text-primary"></Icon>
            </div>
            <Card.Title className="fs-4 fs-xl-3 mb-3 d-block lh-1">
              {title}
            </Card.Title>
            {children}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default AuthLayout;
