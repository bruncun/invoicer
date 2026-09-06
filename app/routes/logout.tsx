import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { clearAuthCookieHeaders } from "~/utility/auth/token";
import { createSupabaseServerClient } from "~/utility/supabase/server";

/**
 * The shell submits this action as a normal form. It works before JavaScript
 * loads. It does not need the Refine auth provider.
 */
export async function action({ request }: ActionFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);
  try {
    await client.auth.signOut();
  } finally {
    const responseHeaders = headers();
    responseHeaders.append("Set-Cookie", clearAuthCookieHeaders()["Set-Cookie"]);

    throw redirect("/login", { headers: responseHeaders });
  }
}
