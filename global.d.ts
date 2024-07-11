import * as yup from "yup";

declare module "yup" {
  interface StringSchema<TType, TContext, TDefault, TFlags> {
    postcode(message: string): this;
  }
}
