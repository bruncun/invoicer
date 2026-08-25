import * as yup from "yup";

declare module "yup" {
  interface StringSchema<TType, TContext, TDefault, TFlags> {
    postcode(message: string): this;
  }
}

interface Window {
  ENV: {
    SUPABASE_URL?: string;
    SUPABASE_KEY?: string;
  };
}
