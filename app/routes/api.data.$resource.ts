import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { createSupabaseServerClient } from "~/utility/supabase/server";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);
  const url = new URL(request.url);
  const from = (Number(url.searchParams.get("current") ?? 1) - 1) * Number(url.searchParams.get("pageSize") ?? 10);
  const to = from + Number(url.searchParams.get("pageSize") ?? 10) - 1;
  const filters = JSON.parse(url.searchParams.get("filters") ?? "[]") as Array<{
    field: string;
    operator: string;
    value: unknown;
  }>;
  const sorters = JSON.parse(url.searchParams.get("sorters") ?? "[]") as Array<{
    field: string;
    order: "asc" | "desc";
  }>;
  let query = client
    .from(params.resource as "invoices")
    .select("*, items(*)", { count: "exact" });
  for (const filter of filters) {
    if (filter.operator === "in") query = query.in(filter.field, filter.value as string[]);
    else if (filter.operator === "eq") query = query.eq(filter.field, filter.value);
  }
  for (const sorter of sorters.length ? sorters : [{ field: "payment_due", order: "asc" as const }]) {
    query = query.order(sorter.field, { ascending: sorter.order === "asc" });
  }
  const { data, count, error } = await query.range(from, to);
  if (error) return json({ error: error.message }, { status: 400, headers: headers() });
  return json({ data, total: count ?? data.length }, { headers: headers() });
}

export async function action({ params, request }: ActionFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);
  const values = await request.json();
  const { data, error } = await client.from(params.resource as "invoices").insert(values).select().single();
  if (error) return json({ error: error.message }, { status: 400, headers: headers() });
  return json({ data }, { headers: headers() });
}
