import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [
  { title: "Invoices | Invoicer" },
  {
    name: "description",
    content: "Create, manage, and send professional invoices with Invoicer.",
  },
];

export default function InvoiceListIndex() {
  return null;
}
