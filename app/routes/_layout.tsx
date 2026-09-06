import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import Layout from "~/components/layout";
import { clearAuthCookieHeaders } from "~/utility/auth/token";
import { getSessionClaims, loginUrl } from "~/utility/auth/session.server";

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
  const claims = await getSessionClaims(request);

  if (!claims) {
    throw redirect(loginUrl(request), {
      headers: clearAuthCookieHeaders(),
    });
  }

  return {};
}
