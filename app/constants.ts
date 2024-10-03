import * as yup from "yup";
import { Status } from "./types/invoices";

export const TOKEN_KEY = "supabase-token";
export const STATUSES: Status[] = ["draft", "pending", "paid"];
export const REQUIRED = "This field is required";
export const INVALID_EMAIL = "Invalid email address";

export const credentialsSchema = yup.object().shape({
  email: yup.string().email(INVALID_EMAIL).required(REQUIRED),
  password: yup.string().required(REQUIRED),
});

export const TOOLTIP_DELAY = { show: 0, hide: 0 };

export const itemSchema = yup.object().shape({
  id: yup.number().optional(),
  name: yup.string().required(REQUIRED),
  price: yup.number().min(0, "Must be > $0").required(REQUIRED),
  quantity: yup.number().min(1, "Must be > 1").required(REQUIRED),
  user_id: yup.string().optional(),
});

export const invoiceSchema = yup.object().shape({
  id: yup.number().optional(),
  client_city: yup.string().required(REQUIRED),
  client_country: yup.string().required(REQUIRED),
  client_email: yup.string().email(INVALID_EMAIL).required(REQUIRED),
  client_name: yup.string().required(REQUIRED),
  client_postcode: yup
    .string()
    .required(REQUIRED)
    .test("is-postcode", "Invalid postcode", (value) => {
      const postcodeRegex = /^[A-Za-z0-9]{3,}$/;
      return postcodeRegex.test(value);
    }),
  client_street: yup.string().required(REQUIRED),
  description: yup.string().required(REQUIRED),
  invoice_date: yup.string().optional(),
  payment_due: yup.string().required(REQUIRED),
  payment_terms: yup.string().required(REQUIRED),
  sender_city: yup.string().required(REQUIRED),
  sender_country: yup.string().required(REQUIRED),
  sender_postcode: yup
    .string()
    .required(REQUIRED)
    .test("is-postcode", "Invalid postcode", (value) => {
      const postcodeRegex = /^[A-Za-z0-9]{3,}$/;
      return postcodeRegex.test(value);
    }),
  sender_street: yup.string().required(REQUIRED),
  status: yup
    .string()
    .oneOf(["draft", "pending", "paid"], "Invalid status")
    .required(REQUIRED),
  user_id: yup.string().optional(),
  items: yup
    .array()
    .of(itemSchema)
    .min(1, "At least one item is required")
    .required(REQUIRED),
});
