import { Tables } from "./supabase";

export type InvoiceDto = {
  client_id: string;
  total: number;
  sender_address_id: string;
  client_address_id: string;
  sender_street?: string;
  sender_city?: string;
  sender_postcode?: string;
  sender_country?: string;
  client_name: string;
  client_email: string;
  client_street?: string;
  client_city?: string;
  client_postcode?: string;
  client_country?: string;
  payment_due: string;
  payment_terms: string;
  description: string;
  status: Status;
  items: Item[];
};

export type Item = {
  id?: number;
  name: string;
  quantity: number;
  price: number;
};

export type Status = "draft" | "pending" | "paid";

export type InvoiceWithRelated = Tables<"invoices"> & {
  clientAddress: Tables<"addresses">;
  senderAddress: Tables<"addresses">;
  client: Tables<"clients">;
  items: Array<Tables<"items">>;
};
