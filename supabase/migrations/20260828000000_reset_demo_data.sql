create or replace function public.reset_demo_data(
  p_user_id uuid,
  p_invoices jsonb
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invoice jsonb;
  v_invoice_id bigint;
  v_count integer := 0;
begin
  delete from public.items where user_id = p_user_id;
  delete from public.invoices where user_id = p_user_id;

  for v_invoice in select value from jsonb_array_elements(p_invoices)
  loop
    insert into public.invoices (
      client_city, client_country, client_email, client_name,
      client_postcode, client_street, description, payment_due,
      payment_terms, sender_city, sender_country, sender_postcode,
      sender_street, status, user_id
    ) values (
      v_invoice->>'client_city', v_invoice->>'client_country',
      v_invoice->>'client_email', v_invoice->>'client_name',
      v_invoice->>'client_postcode', v_invoice->>'client_street',
      v_invoice->>'description', (v_invoice->>'payment_due')::date,
      v_invoice->>'payment_terms', 'London', 'United Kingdom',
      'SW1A 1AA', '20 Canada Square', v_invoice->>'status', p_user_id
    ) returning id into v_invoice_id;

    insert into public.items (invoice_id, name, quantity, price, user_id)
    select
      v_invoice_id,
      item->>'name',
      (item->>'quantity')::integer,
      (item->>'price')::numeric,
      p_user_id
    from jsonb_array_elements(v_invoice->'items') as item;

    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;

revoke all on function public.reset_demo_data(uuid, jsonb) from public;
grant execute on function public.reset_demo_data(uuid, jsonb) to service_role;
