import { PropsWithChildren } from "react";
import { Menu } from "../menu";
import { Container } from "react-bootstrap";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Menu></Menu>
      <Container
        className="d-flex flex-column"
        style={{ minHeight: "calc(100vh - 5.5rem)" }}
      >
        {children}
      </Container>
    </>
  );
};
