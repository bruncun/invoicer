import useTheme from "~/hooks/use-theme";
import authLogo from "~/assets/auth-logo.svg";

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
};

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  useTheme();

  return (
    <div className="light-bg-gray-100 dark-bg-gray-950 ps-xl-navbar position-relative min-dvh-100">
      <div className="container align-items-center position-absolute top-50 start-50 translate-middle w-100">
        <div className="row">
          <div className="col-md-8 col-lg-6 col-xl-4 mx-auto">
            <div className="d-flex align-items-center flex-column w-100">
              <img
                src={authLogo}
                width={28}
                height={26}
                alt="Logo for Invoicer: a purple circle with a missing top slice."
                title="Invoicer"
              />
              <span className="fs-4 fs-xl-3 my-4 text-body-emphasis">
                {title}
              </span>
              {subtitle}
            </div>
            <div className="card rounded-4 rounded">
              <div className="card-body p-4">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
