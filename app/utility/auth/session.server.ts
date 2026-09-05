import { getTokenFromRequest, isTokenExpired } from "~/utility/auth/token";
import { createSupabaseServerClient } from "~/utility/supabase/server";

/**
 * Verifies the request session without making a second request to this app.
 *
 * This must stay server-only because it reads the HTTP-only session cookie.
 */
export async function getSessionUser(request: Request) {
  if (isTokenExpired(getTokenFromRequest(request))) return null;

  const { client } = createSupabaseServerClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();

  return user;
}

export function loginUrl(request: Request) {
  return `/login?to=${encodeURIComponent(new URL(request.url).pathname)}`;
}
