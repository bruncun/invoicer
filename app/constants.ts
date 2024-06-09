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
