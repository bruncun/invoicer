import { json, type ActionFunctionArgs } from "@remix-run/node";
import { serialize } from "cookie";
import { createSupabaseServerClient } from "~/utility/supabase/server";
import { TOKEN_KEY } from "~/constants";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.json();
  const { client, headers } = createSupabaseServerClient(request);
  let result: any;
  if (body.operation === "login") result = await client.auth.signInWithPassword(body);
  else if (body.operation === "demo-login") {
    const email = process.env.DEMO_EMAIL;
    const password = process.env.DEMO_PASSWORD;

    if (!email || !password) {
      return json(
        { error: "Demo login is not configured" },
        { status: 503, headers: headers() }
      );
    }

    result = await client.auth.signInWithPassword({ email, password });
  }
  else if (body.operation === "register") result = await client.auth.signUp(body);
  else if (body.operation === "logout") {
    result = await client.auth.signOut();
    if (result.error) {
      return json({ error: result.error.message }, { status: 400, headers: headers() });
    }
    const responseHeaders = headers();
    responseHeaders.append(
      "Set-Cookie",
      serialize(TOKEN_KEY, "", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      })
    );
    return json({ data: null }, { headers: responseHeaders });
  }
  else if (body.operation === "check") result = await client.auth.getUser();
  else if (body.operation === "identity") result = await client.auth.getUser();
  else if (body.operation === "reset") result = await client.auth.resetPasswordForEmail(body.email);
  else if (body.operation === "update-password") result = await client.auth.updateUser({ password: body.password });
  else return json({ error: "Unsupported auth operation" }, { status: 400 });
  if (result.error) {
    const isSessionCheck = body.operation === "check" || body.operation === "identity";
    if (isSessionCheck) {
      const responseHeaders = headers();
      responseHeaders.append(
        "Set-Cookie",
        serialize(TOKEN_KEY, "", {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          maxAge: 0,
        })
      );
      return json({ data: { user: null } }, { headers: responseHeaders });
    }

    return json({ error: result.error.message }, { status: 400, headers: headers() });
  }
  const responseHeaders = headers();
  if (result.data?.session?.access_token) {
    responseHeaders.append("Set-Cookie", serialize(TOKEN_KEY, result.data.session.access_token, { httpOnly: true, sameSite: "lax", path: "/" }));
  }
  return json({ data: result.data }, { headers: responseHeaders });
}
