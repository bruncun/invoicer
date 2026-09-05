import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { clearAuthCookieHeaders } from "~/utility/auth/token";
import { getSessionUser } from "~/utility/auth/session.server";

/**
 * Since we don't have any routes for the index page, we're redirecting the user to the first resource.
 *
 * This can also be done using the `loader` function and `redirect`.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getSessionUser(request);
  throw redirect(user ? "/invoices" : "/login", {
    headers: user ? undefined : clearAuthCookieHeaders(),
  });
}
