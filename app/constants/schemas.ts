import * as yup from "yup";
import { constants } from "./constants";
import { Enums } from "~/types/supabase";
import { STATUSES } from "~/constants";

const { validString, validEmail } = constants;

const validPassword = yup
  .string()
  .trim()
  .min(8, "Password must be at least 8 characters")
  .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
  .matches(/[a-z]/, "Password must contain at least one lowercase letter")
  .matches(/[0-9]/, "Password must contain at least one number")
  .matches(/[\W_]/, "Password must contain at least one special character")
  .required("Password is required");

export const credentialsSchema = yup.object().shape({
  email: validEmail.required("Email is required"),
  password: validString.required("Password is required"),
  rememberMe: yup.boolean().optional(),
});

export const newCredentialsSchema = yup.object().shape({
  email: validEmail.required("Email is required"),
  password: validPassword.required("Password is required"),
});

export const itemSchema = yup.object().shape({
  id: yup.number().optional(),
  name: validString
    .min(3, "Item name must be at least 3 characters")
    .max(255, "Item name must be 255 characters or less")
    .required("Item name is required"),
  price: yup.number().required("Price is required"),
  quantity: yup
    .number()
    .typeError("Quantity must be a number")
    .integer("Quantity must be an integer")
    .min(1, "Quantity must be at least 1")
    .required("Quantity is required"),
  user_id: yup.string().trim().optional(),
});

const validDate = validString.matches(
  /^\d{4}-\d{2}-\d{2}$/,
  "Date must be in the format YYYY-MM-DD"
);

export const invoiceSchema = yup.object().shape({
  id: yup.number().optional(),
  client_city: validString
    .min(2, "Client city must be at least 2 characters")
    .max(255, "Client city must be 255 characters or less")
    .required("Client city is required"),
  client_country: validString
    .min(2, "Client country must be at least 2 characters")
    .max(255, "Client country must be 255 characters or less")
    .required("Client country is required"),
  client_email: validEmail.required("Client email is required"),
  client_name: validString
    .min(2, "Client name must be at least 2 characters")
    .max(255, "Client name must be 255 characters or less")
    .required("Client name is required"),
  client_postcode: yup
    .string()
    .trim()
    .postcode("Invalid client postcode")
    .required("Client postcode is required")
    .max(10, "Client postcode must be 10 characters or less"),
  client_street: validString
    .min(5, "Client street must be at least 5 characters")
    .max(255, "Client street must be 255 characters or less")
    .required("Client street is required"),
  description: validString
    .min(10, "Description must be at least 10 characters")
    .max(255, "Description must be 255 characters or less")
    .required("Description is required"),
  invoice_date: validDate.optional(),
  payment_due: validDate
    .required("Payment due date is required")
    .test(
      "is-after-invoice",
      "Payment due date must be after the invoice date",
      function (value) {
        const { invoice_date } = this.parent;
        return (
          !invoice_date || !value || new Date(value) > new Date(invoice_date)
        );
      }
    ),
  payment_terms: yup
    .number()
    .integer("Payment terms must be an integer")
    .required("Payment terms are required"),
  sender_city: validString
    .min(2, "Sender city must be at least 2 characters")
    .max(255, "Sender city must be 255 characters or less")
    .required("Sender city is required"),
  sender_country: validString
    .min(2, "Sender country must be at least 2 characters")
    .max(255, "Sender country must be 255 characters or less")
    .required("Sender country is required"),
  sender_postcode: yup
    .string()
    .trim()
    .postcode("Invalid sender postcode")
    .required("Sender postcode is required")
    .max(10, "Sender postcode must be 10 characters or less"),
  sender_street: validString
    .min(5, "Sender street must be at least 5 characters")
    .max(255, "Sender street must be 255 characters or less")
    .required("Sender street is required"),
  status: yup
    .mixed<Enums<"status">>()
    .required("Status is required")
    .oneOf(Object.values(STATUSES), "Invalid status"),
  user_id: yup.string().trim().optional(),
  items: yup
    .array()
    .of(itemSchema)
    .min(1, "At least one item is required")
    .required("At least one item is required"),
});

export const schemas = {
  credentialsSchema,
  itemSchema,
  invoiceSchema,
};
