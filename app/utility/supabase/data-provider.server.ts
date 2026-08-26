import { redirect } from "@remix-run/node";
import { dataProvider as createDataProvider } from "@refinedev/supabase";
import { serialize } from "cookie";
import { TOKEN_KEY } from "~/constants";
import { getTokenFromRequest, isTokenExpired } from "~/utility/auth/token";

export function dataProvider(client: Parameters<typeof createDataProvider>[0], request?: Request) {
  if (request && isTokenExpired(getTokenFromRequest(request))) {
    throw redirect(`/login?to=${encodeURIComponent(new URL(request.url).pathname)}`, {
      headers: {
        "Set-Cookie": serialize(TOKEN_KEY, "", {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          maxAge: 0,
        }),
      },
    });
  }

  return createDataProvider(client);
}
