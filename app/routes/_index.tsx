import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { authProvider } from "~/utility/refine/auth-provider";
import { clearAuthCookieHeaders } from "~/utility/auth/token";

/**
 * Since we don't have any routes for the index page, we're redirecting the user to the first resource.
 *
 * This can also be done using the `loader` function and `redirect`.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const { authenticated } = await authProvider.check(request);
  throw redirect(authenticated ? "/invoices" : "/login", {
    headers: authenticated ? undefined : clearAuthCookieHeaders(),
  });
}
