import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { createSupabaseServerClient } from "~/utility/supabase/server";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);
  const query = client.from(params.resource as "invoices");
  const { data, error } = await query
    .select("*, items(*)")
    .eq("id", params.id as string)
    .single();
  if (error) return json({ error: error.message }, { status: 404, headers: headers() });
  return json({ data }, { headers: headers() });
}

export async function action({ params, request }: ActionFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);
  if (request.method === "PATCH") {
    const values = await request.json();
    const { data, error } = await client
      .from(params.resource as "invoices")
      .update(values)
      .eq("id", params.id as string)
      .select()
      .single();
    if (error) return json({ error: error.message }, { status: 400, headers: headers() });
    return json({ data }, { headers: headers() });
  }
  if (request.method === "DELETE") {
    const { data, error } = await client
      .from(params.resource as "invoices")
      .delete()
      .eq("id", params.id as string)
      .select()
      .single();
    if (error) return json({ error: error.message }, { status: 400, headers: headers() });
    return json({ data }, { headers: headers() });
  }
  return json({ error: "Method not allowed" }, { status: 405 });
}
