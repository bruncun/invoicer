import { json, type ActionFunctionArgs } from "@remix-run/node";
import { createSupabaseServerClient } from "~/utility/supabase/server";

export async function action({ request }: ActionFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);
  const invoice = await request.json();
  const { data, error } = await client.functions.invoke("send-invoice", {
    body: invoice,
  });
  if (error) return json({ error: error.message }, { status: 400, headers: headers() });
  return json({ data }, { headers: headers() });
}
