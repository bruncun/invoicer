import { createClient } from "@refinedev/supabase";

const SUPABASE_URL = "https://lrqtnqvcexgpyihlurfp.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXRucXZjZXhncHlpaGx1cmZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU5MDExMjcsImV4cCI6MjAzMTQ3NzEyN30.0Tk9l-0VfVg3eVHn4bv-0kJpudIhdbMjYcD_i6pNkd8";

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: {
    schema: "public",
  },
  auth: {
    persistSession: true,
  },
});
