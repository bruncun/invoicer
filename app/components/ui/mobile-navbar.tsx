import { Navbar } from "react-bootstrap";
import { ReactNode } from "react";

type MobileNavbarProps = {
  children: ReactNode;
};

const MobileNavbar = ({ children }: MobileNavbarProps) => {
  return (
    <Navbar
      fixed="bottom"
      className="mobile-navbar px-3 py-2 d-md-none z-1 border-top bg-body"
    >
      {children}
    </Navbar>
  );
};

export default MobileNavbar;
