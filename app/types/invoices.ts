import { Tables } from "./supabase";

export type InvoiceDto = {
  client_id: string;
  total: number;
  sender_address_id: string;
  client_address_id: string;
  senderStreet?: string;
  senderCity?: string;
  senderPostCode?: string;
  senderCountry?: string;
  clientName: string;
  clientEmail: string;
  clientStreet?: string;
  clientCity?: string;
  clientPostCode?: string;
  clientCountry?: string;
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
