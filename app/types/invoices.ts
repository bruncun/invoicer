import { Tables } from "./supabase";

export type Invoice = Tables<"invoices"> & { items: Tables<"items">[] };
