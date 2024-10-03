import { Asserts } from "yup";
import { invoiceSchema } from "~/constants";
import { Tables } from "./supabase";

export type InvoiceSchemaType = Asserts<typeof invoiceSchema>;

export type Invoice = Tables<"invoices"> & { items: Tables<"items">[] };

type AssertInvoiceType = InvoiceSchemaType extends Invoice ? true : false;
type AssertInvoiceSchemaType = Invoice extends InvoiceSchemaType ? true : false;

export type Status = "draft" | "pending" | "paid";
