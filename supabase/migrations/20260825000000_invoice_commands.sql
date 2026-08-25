create or replace function public.invoice_command(
  p_operation text,
  p_invoice jsonb default '{}'::jsonb,
  p_items jsonb default '[]'::jsonb
)
returns public.invoices
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_invoice public.invoices;
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  if p_operation = 'create' then
    insert into public.invoices (
      client_city, client_country, client_email, client_name,
      client_postcode, client_street, description, payment_due,
      payment_terms, sender_city, sender_country, sender_postcode,
      sender_street, status, user_id
    ) values (
      p_invoice->>'client_city', p_invoice->>'client_country',
      p_invoice->>'client_email', p_invoice->>'client_name',
      p_invoice->>'client_postcode', p_invoice->>'client_street',
      p_invoice->>'description', (p_invoice->>'payment_due')::date,
      p_invoice->>'payment_terms', p_invoice->>'sender_city',
      p_invoice->>'sender_country', p_invoice->>'sender_postcode',
      p_invoice->>'sender_street', p_invoice->>'status', auth.uid()
    ) returning * into v_invoice;
  elsif p_operation = 'update' then
    update public.invoices set
      client_city = p_invoice->>'client_city',
      client_country = p_invoice->>'client_country',
      client_email = p_invoice->>'client_email',
      client_name = p_invoice->>'client_name',
      client_postcode = p_invoice->>'client_postcode',
      client_street = p_invoice->>'client_street',
      description = p_invoice->>'description',
      payment_due = (p_invoice->>'payment_due')::date,
      payment_terms = p_invoice->>'payment_terms',
      sender_city = p_invoice->>'sender_city',
      sender_country = p_invoice->>'sender_country',
      sender_postcode = p_invoice->>'sender_postcode',
      sender_street = p_invoice->>'sender_street',
      status = p_invoice->>'status'
    where id = (p_invoice->>'id')::bigint and user_id = auth.uid()
    returning * into v_invoice;

    if not found then
      raise exception 'Invoice not found' using errcode = 'P0002';
    end if;

    delete from public.items where invoice_id = v_invoice.id and user_id = auth.uid();
  elsif p_operation = 'delete' then
    delete from public.items
    where invoice_id = (p_invoice->>'id')::bigint and user_id = auth.uid();

    delete from public.invoices
    where id = (p_invoice->>'id')::bigint and user_id = auth.uid()
    returning * into v_invoice;

    if not found then
      raise exception 'Invoice not found' using errcode = 'P0002';
    end if;

    return v_invoice;
  else
    raise exception 'Unsupported invoice operation' using errcode = '22023';
  end if;

  insert into public.items (invoice_id, name, quantity, price, user_id)
  select
    v_invoice.id,
    item->>'name',
    (item->>'quantity')::integer,
    (item->>'price')::numeric,
    auth.uid()
  from jsonb_array_elements(p_items) as item;

  return v_invoice;
end;
$$;
