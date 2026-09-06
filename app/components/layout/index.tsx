import { PropsWithChildren } from "react";
import useTheme from "~/hooks/use-theme";
import Navbar from "../navbar";

const Layout = ({ children }: PropsWithChildren) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="layout light-bg-gray-100 dark-bg-gray-950 ps-lg-navbar position-relative min-vh-100">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <div className="container py-3 py-lg-4 w-100">
          <div className="row">
            <div className="col-lg-9 mx-auto">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
