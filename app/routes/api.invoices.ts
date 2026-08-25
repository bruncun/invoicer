import { json, type ActionFunctionArgs } from "@remix-run/node";
import { createSupabaseServerClient } from "~/utility/supabase/server";
import type { Json } from "~/types/supabase";

type InvoiceCommand = {
  operation: "create" | "update" | "delete";
  invoice: Record<string, unknown>;
  items?: Record<string, unknown>[];
};

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  const command = (await request.json()) as InvoiceCommand;
  const { client, headers } = createSupabaseServerClient(request);
  const { data: userData } = await client.auth.getUser();

  if (!userData.user) {
    return json({ error: "Unauthenticated" }, { status: 401, headers: headers() });
  }

  const { data, error } = await client.rpc("invoice_command", {
    p_operation: command.operation,
    p_invoice: command.invoice as Json,
    p_items: (command.items ?? []) as Json,
  });

  if (error) {
    return json({ error: error.message }, { status: 400, headers: headers() });
  }

  return json({ data }, { headers: headers() });
}
