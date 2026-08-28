import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type FixtureInvoice = {
  description: string;
  payment_due: string;
  payment_terms: "30" | "60" | "90";
  status: "draft" | "pending" | "paid";
  client_name: string;
  client_email: string;
  client_street: string;
  client_city: string;
  client_postcode: string;
  client_country: string;
  items: { name: string; quantity: number; price: number }[];
};

const fixtureTemplates: FixtureInvoice[] = [
  { description: "Brand identity", payment_due: "2026-09-03", payment_terms: "30", status: "pending", client_name: "Alexis Davis", client_email: "alexis@example.com", client_street: "19 Union Terrace", client_city: "London", client_postcode: "E1 3EZ", client_country: "United Kingdom", items: [{ name: "Brand guidelines", quantity: 1, price: 1800 }, { name: "Logo design", quantity: 1, price: 900 }] },
  { description: "Website redesign", payment_due: "2026-09-08", payment_terms: "30", status: "paid", client_name: "Owen Wright", client_email: "owen@example.com", client_street: "1 Main Street", client_city: "New York", client_postcode: "10001", client_country: "United States", items: [{ name: "Design system", quantity: 1, price: 1200 }, { name: "Responsive layouts", quantity: 1, price: 1600 }] },
  { description: "Logo design", payment_due: "2026-09-12", payment_terms: "60", status: "draft", client_name: "Jensen Huang", client_email: "jensen@example.com", client_street: "42 Market Road", client_city: "Toronto", client_postcode: "M5V 2T6", client_country: "Canada", items: [{ name: "Logo concepts", quantity: 3, price: 450 }] },
  { description: "Mobile application", payment_due: "2026-09-17", payment_terms: "30", status: "pending", client_name: "Mia Anderson", client_email: "mia@example.com", client_street: "7 King Street", client_city: "Sydney", client_postcode: "2000", client_country: "Australia", items: [{ name: "UX audit", quantity: 1, price: 950 }, { name: "Prototype", quantity: 1, price: 2100 }] },
  { description: "Consulting services", payment_due: "2026-09-21", payment_terms: "90", status: "paid", client_name: "Robert Fox", client_email: "robert@example.com", client_street: "88 High Street", client_city: "Edinburgh", client_postcode: "EH1 1AA", client_country: "United Kingdom", items: [{ name: "Technical review", quantity: 2, price: 650 }] },
  { description: "Illustration package", payment_due: "2026-09-25", payment_terms: "30", status: "draft", client_name: "Samantha Clark", client_email: "samantha@example.com", client_street: "12 Park Avenue", client_city: "Chicago", client_postcode: "60601", client_country: "United States", items: [{ name: "Editorial illustrations", quantity: 5, price: 300 }] },
  { description: "Content strategy", payment_due: "2026-10-02", payment_terms: "60", status: "pending", client_name: "William Kim", client_email: "william@example.com", client_street: "55 Queen Street", client_city: "Vancouver", client_postcode: "V6B 1A1", client_country: "Canada", items: [{ name: "Content audit", quantity: 1, price: 700 }, { name: "Strategy workshop", quantity: 2, price: 500 }] },
  { description: "Product photography", payment_due: "2026-10-07", payment_terms: "30", status: "paid", client_name: "Grace Lee", client_email: "grace@example.com", client_street: "3 Harbour Road", client_city: "Melbourne", client_postcode: "3000", client_country: "Australia", items: [{ name: "Photography day", quantity: 1, price: 1500 }, { name: "Image editing", quantity: 12, price: 45 }] },
  { description: "SEO optimisation", payment_due: "2026-10-14", payment_terms: "90", status: "draft", client_name: "Ethan Smith", client_email: "ethan@example.com", client_street: "24 River Lane", client_city: "Manchester", client_postcode: "M1 1AE", client_country: "United Kingdom", items: [{ name: "SEO research", quantity: 1, price: 800 }, { name: "Technical fixes", quantity: 1, price: 1100 }] },
  { description: "Email campaign", payment_due: "2026-10-19", payment_terms: "30", status: "pending", client_name: "Olivia Wilson", client_email: "olivia@example.com", client_street: "9 Lake Street", client_city: "Boston", client_postcode: "02108", client_country: "United States", items: [{ name: "Campaign design", quantity: 1, price: 500 }, { name: "Copywriting", quantity: 1, price: 650 }] },
  { description: "Architecture review", payment_due: "2026-10-24", payment_terms: "60", status: "paid", client_name: "Noah Martin", client_email: "noah@example.com", client_street: "61 King William Street", client_city: "Adelaide", client_postcode: "5000", client_country: "Australia", items: [{ name: "Architecture review", quantity: 1, price: 1800 }] },
  { description: "Quarterly support", payment_due: "2026-10-30", payment_terms: "30", status: "draft", client_name: "Emma Thompson", client_email: "emma@example.com", client_street: "15 Wellington Road", client_city: "Dublin", client_postcode: "D02 XY12", client_country: "Ireland", items: [{ name: "Support hours", quantity: 10, price: 120 }] },
];

const fixture: FixtureInvoice[] = Array.from({ length: 500 }, (_, index) => {
  const template = fixtureTemplates[index % fixtureTemplates.length];
  const dueDate = new Date(Date.UTC(2026, 0, 1 + index));

  return {
    ...template,
    description: `${template.description} ${String(index + 1).padStart(3, "0")}`,
    payment_due: dueDate.toISOString().slice(0, 10),
    client_name: `${template.client_name} ${index + 1}`,
    client_email: `client-${String(index + 1).padStart(3, "0")}@example.com`,
    items: template.items.map((item, itemIndex) => ({
      ...item,
      quantity: item.quantity + ((index + itemIndex) % 3),
      price: item.price + (index % 10) * 25,
    })),
  };
});

const jsonHeaders = { "Content-Type": "application/json" };

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST required" }), { status: 405, headers: jsonHeaders });
  }

  const serviceRoleKey =
    Deno.env.get("DEMO_RESET_SERVICE_KEY") ??
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const resetSecret = Deno.env.get("RESET_DEMO_SECRET");
  const authorization = request.headers.get("Authorization");
  const suppliedSecret = request.headers.get("x-reset-secret");

  if (!serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Reset function is not configured" }), { status: 500, headers: jsonHeaders });
  }

  const authorized = authorization === `Bearer ${serviceRoleKey}` || Boolean(resetSecret && suppliedSecret === resetSecret);
  if (!authorized) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: jsonHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const demoEmail = Deno.env.get("DEMO_EMAIL");
  if (!supabaseUrl || !demoEmail) {
    return new Response(JSON.stringify({ error: "Supabase URL or demo email is not configured" }), { status: 500, headers: jsonHeaders });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  console.log("Reset started", { demoEmail });
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
  const demoUser = users?.users.find((user) => user.email === demoEmail);

  if (usersError || !demoUser) {
    return new Response(JSON.stringify({ error: usersError?.message ?? "Demo user not found" }), { status: 500, headers: jsonHeaders });
  }

  console.log("Demo user found", { userId: demoUser.id });
  const { data: resetCount, error: resetError } = await supabase.rpc("reset_demo_data", {
    p_user_id: demoUser.id,
    p_invoices: fixture,
  });
  if (resetError || resetCount !== fixture.length) {
    console.error("Reset failed", resetError?.message ?? `Expected ${fixture.length} invoices, received ${resetCount}`);
    return new Response(JSON.stringify({ error: resetError?.message ?? "Demo data reset failed" }), { status: 500, headers: jsonHeaders });
  }

  console.log("Reset completed", { invoices: fixture.length });
  return new Response(JSON.stringify({ reset: true, invoices: fixture.length }), { status: 200, headers: jsonHeaders });
});
