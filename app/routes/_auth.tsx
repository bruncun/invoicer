import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { lazy, Suspense } from "react";
import { clearAuthCookieHeaders } from "~/utility/auth/token";
import { getSessionClaims } from "~/utility/auth/session.server";

const LazyRefineProvider = lazy(() => import("~/components/refine-provider"));

export default function AuthLayout() {
  return (
    <Suspense fallback={null}>
      <LazyRefineProvider>
        <Outlet />
      </LazyRefineProvider>
    </Suspense>
  );
}

/**
 * If the current session is authenticated, we're redirecting the user to the home page.
 * Alternatively, we could also use the `Authenticated` component inside the `AuthLayout` to handle the redirect.
 * But, server-side redirects are more performant.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const claims = await getSessionClaims(request);

  if (claims) {
    throw redirect("/");
  }

  return json({}, { headers: clearAuthCookieHeaders() });
}
