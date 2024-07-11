import { Card, Col, Container, Row } from "react-bootstrap";
import Icon from "~/components/icon";
import useTheme from "~/hooks/use-theme";
import logoSvg from "~/assets/logo.svg";

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
};

const AuthLayout = ({ children, title }: AuthLayoutProps) => {
  useTheme();

  return (
    <Container className="align-items-center position-absolute top-50 start-50 translate-middle w-100">
      <Row>
        <Col
          md={{ span: 8 }}
          lg={{ span: 6 }}
          xl={{ span: 4 }}
          className="mx-auto"
        >
          <div className="d-flex align-items-center flex-column w-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="26">
              <path
                fill="#674dcf"
                fillRule="evenodd"
                d="M20.513 0C24.965 2.309 28 6.91 28 12.21 28 19.826 21.732 26 14 26S0 19.826 0 12.21C0 6.91 3.035 2.309 7.487 0L14 12.9z"
              />
            </svg>
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
  );
};

export default AuthLayout;
