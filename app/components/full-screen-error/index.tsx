import authLogo from "~/assets/auth-logo.svg";

const FullScreenError = () => (
  <div className="light-bg-gray-100 dark-bg-gray-950 min-vh-100 d-flex align-items-center">
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5 mx-auto">
          <div className="text-center mb-4">
            <img
              src={authLogo}
              width={28}
              height={26}
              alt="Invoicer"
              title="Invoicer"
              className="mb-4"
            />
            <p className="text-primary fw-semibold text-uppercase small mb-2">
              Something went wrong
            </p>
            <h1 className="fs-3 text-body-emphasis mb-2">
              We could not load <br className="d-sm-none" />this page
            </h1>
            <p className="text-muted mb-0">Sorry, please try again.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default FullScreenError;
