import type { Invoice } from "~/types/invoices";

type InvoiceCommand = {
  operation: "create" | "update" | "delete";
  invoice: Record<string, unknown>;
  items?: Record<string, unknown>[];
};

export async function invoiceAction(command: InvoiceCommand) {
  const response = await fetch("/api/invoices", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(command),
  });
  const result = (await response.json()) as { data?: Invoice; error?: string };
  if (!response.ok || !result.data) {
    throw new Error(result.error ?? "Invoice operation failed");
  }
  return result.data;
}
