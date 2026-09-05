import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { clearAuthCookieHeaders } from "~/utility/auth/token";
import { getSessionUser } from "~/utility/auth/session.server";

export default function AuthLayout() {
  return <Outlet />;
}

/**
 * If the current session is authenticated, we're redirecting the user to the home page.
 * Alternatively, we could also use the `Authenticated` component inside the `AuthLayout` to handle the redirect.
 * But, server-side redirects are more performant.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getSessionUser(request);

  if (user) {
    throw redirect("/");
  }

  return json({}, { headers: clearAuthCookieHeaders() });
}
