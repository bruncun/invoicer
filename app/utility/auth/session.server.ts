import { createSupabaseServerClient } from "~/utility/supabase/server";

/**
 * Verifies the request session without making a second request to this app.
 *
 * This must stay server-only because it reads the HTTP-only session cookie.
 */
export async function getSessionClaims(request: Request) {
  const { client } = createSupabaseServerClient(request);
  const { data, error } = await client.auth.getClaims();

  if (error || !data?.claims?.sub) return null;
  return data.claims;
}

export function loginUrl(request: Request) {
  return `/login?to=${encodeURIComponent(new URL(request.url).pathname)}`;
}
