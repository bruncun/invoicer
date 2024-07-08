import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import Layout from "~/components/layout";
import { authProvider } from "~/utility/refine/auth-provider";

export default function BaseLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

/**
 * We're checking if the current session is authenticated.
 * If not, we're redirecting the user to the login page.
 * This is applied for all routes that are nested under this layout (_protected).
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const { authenticated, redirectTo } = await authProvider.check(request);

  if (!authenticated) {
    throw redirect(redirectTo ?? "/login");
  }

  return {};
}
