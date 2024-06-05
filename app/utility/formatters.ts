import { format } from "date-fns";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDisplayDate(date: string): string {
  return format(new Date(date), "MMM dd yyyy");
}
