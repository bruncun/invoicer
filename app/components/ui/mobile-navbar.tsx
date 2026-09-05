import { ReactNode } from "react";

type MobileNavbarProps = {
  children: ReactNode;
};

const MobileNavbar = ({ children }: MobileNavbarProps) => {
  return (
    <nav className="navbar fixed-bottom light-bg-body dark-bg-dark px-3 py-2 d-md-none z-1 border-top bg-body">
      {children}
    </nav>
  );
};

export default MobileNavbar;
