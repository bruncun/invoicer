import "dotenv/config";

import { createServerClient } from "@supabase/ssr";
import { parse, serialize } from "cookie";
import { Database } from "~/types/supabase";
import { TOKEN_KEY } from "~/constants/constants";

const getEnv = () => {
  const env = process.env;
  if (!env.SUPABASE_URL || !env.SUPABASE_KEY) {
    throw new Error("SUPABASE_URL and SUPABASE_KEY must be set");
  }
  return { url: env.SUPABASE_URL, key: env.SUPABASE_KEY };
};

export function createSupabaseServerClient(request: Request) {
  const { url, key } = getEnv();
  const setCookies: string[] = [];
  const cookies = request.headers.get("Cookie") ?? "";
  const parsedCookies = parse(cookies);
  const token = parsedCookies[TOKEN_KEY];

  const client = createServerClient<Database>(url, key, {
    db: { schema: "public" },
    global: token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : undefined,
    cookies: {
      getAll() {
        return Object.entries(parsedCookies).map(([name, value]) => ({
          name,
          value,
        }));
      },
      setAll(items) {
        for (const { name, value, options } of items) {
          setCookies.push(serialize(name, value, options));
        }
      },
    },
  });

  return {
    client,
    headers: () => {
      const headers = new Headers();
      for (const value of setCookies) headers.append("Set-Cookie", value);
      return headers;
    },
  };
}
