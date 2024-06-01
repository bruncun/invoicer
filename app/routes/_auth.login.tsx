import { AuthPage } from "@refinedev/core";

export default function Login() {
  return (
    <AuthPage
      type="login"
      renderContent={(content) => (
        <div>
          <p
            style={{
              padding: 10,
              color: "#004085",
              backgroundColor: "#cce5ff",
              borderColor: "#b8daff",
              textAlign: "center",
            }}
          >
            email: info@refine.dev
            <br /> password: refine-supabase
          </p>
          {content}
        </div>
      )}
    />
  );
}
