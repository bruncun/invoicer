import type { Enums } from "~/types/supabase";

export const TOOLTIP_SHOW = { show: 500, hide: 0 };
export const TOKEN_KEY = "supabase-token";
export const STATUSES: Enums<"status">[] = ["draft", "pending", "paid"];
export const PAYMENT_TERMS: Enums<"payment_terms">[] = ["30", "60", "90"];
