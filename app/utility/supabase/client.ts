import { createClient } from "@refinedev/supabase";
import { Database } from "~/types/supabase";

type PublicEnv = {
  SUPABASE_URL?: string;
  SUPABASE_KEY?: string;
};

const publicEnv = (globalThis as typeof globalThis & { ENV?: PublicEnv }).ENV;
const serverEnv = (globalThis as typeof globalThis & {
  process?: { env?: PublicEnv };
}).process?.env;

const SUPABASE_URL = publicEnv?.SUPABASE_URL ?? serverEnv?.SUPABASE_URL;
const SUPABASE_KEY = publicEnv?.SUPABASE_KEY ?? serverEnv?.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_KEY must be set");
}

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
