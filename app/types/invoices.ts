import { Tables } from "./supabase";

export type InvoiceDto = {
  clientId: string;
  total: number;
  senderAddressId: string;
  clientAddressId: string;
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
  paymentDue: string;
  paymentTerms: string;
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
