import { createClient } from "@refinedev/supabase";
import { Database } from "~/types/supabase";

const SUPABASE_URL = "https://vwyfptctuwjdqmnoskhr.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3eWZwdGN0dXdqZHFtbm9za2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc2Mjg2OTAsImV4cCI6MjAzMzIwNDY5MH0.kndzFB58_9gsJdmsLFSViUZgyDKbwPmHnqnnQQA7-SI";

export const supabaseClient = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_KEY,
  {
    db: {
      schema: "public",
    },
    auth: {
      persistSession: true,
    },
  }
);
