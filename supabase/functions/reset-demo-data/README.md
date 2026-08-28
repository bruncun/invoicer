# Reset demo data

This function is operational only. It has no route or control in the Invoicer application.

Before the first deployment, run the matching migration in `supabase/migrations/20260828000000_reset_demo_data.sql` against the hosted database. The function uses that database transaction to replace the demo data safely.

Set these Edge Function secrets:

- `SUPABASE_URL`
- `DEMO_RESET_SERVICE_KEY` (the Supabase `service_role` key)
- `DEMO_EMAIL`
- `RESET_DEMO_SECRET` (optional when invoking with the service-role bearer token)

Deploy it with:

```bash
supabase functions deploy reset-demo-data
```

Invoke it from the Supabase dashboard, or with an operational request using the service-role key:

```bash
curl -X POST https://<project-ref>.supabase.co/functions/v1/reset-demo-data \
  -H "Authorization: Bearer <service-role-key>"
```

For the daily reset, create a Supabase scheduled function invocation for `reset-demo-data` in the Supabase dashboard. Use a daily schedule and send the service-role bearer token. Do not place that token in the application or commit it to the repository.
