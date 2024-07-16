import { Card, Col, Container, Row } from "react-bootstrap";
import useTheme from "~/hooks/use-theme";
import authLogo from "~/assets/auth-logo.svg";

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
};

const AuthLayout = ({ children, title }: AuthLayoutProps) => {
  useTheme();

  return (
    <div className="light-bg-gray-100 dark-bg-gray-950 ps-xl-navbar position-relative min-vh-100">
      <Container className="align-items-center position-absolute top-50 start-50 translate-middle w-100">
        <Row>
          <Col
            md={{ span: 8 }}
            lg={{ span: 6 }}
            xl={{ span: 4 }}
            className="mx-auto"
          >
            <div className="d-flex align-items-center flex-column w-100">
              <img
                src={authLogo}
                alt="Logo for Invoicer: a purple circle with a missing top slice."
                title="Invoicer"
              />
              <span className="fs-4 fs-xl-3 my-4 text-body-emphasis">
                {title}
              </span>
            </div>
            <Card className="rounded-4 rounded">
              <Card.Body className="p-4">{children}</Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AuthLayout;
