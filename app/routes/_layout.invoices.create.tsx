import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import InvoicesModalForm from "~/components/invoices/modal-form";
import useInvoicesCreateModalForm from "~/hooks/invoices/use-create-modal-form";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "/invoice-form.css" },
];

export const meta: MetaFunction = () => [
  { title: "Create new Invoice | Invoicer" },
  {
    name: "description",
    content: "Create, manage, and send professional invoices with Invoicer.",
  },
];

export default function InvoiceCreate() {
  const navigate = useNavigate();
  const form = useInvoicesCreateModalForm();

  useEffect(() => {
    form.modal.show();
  }, [form.modal]);

  return (
    <InvoicesModalForm
      title="New Invoice"
      invoicesModalForm={{
        ...form,
        modal: { ...form.modal, close: () => navigate("/invoices") },
      }}
    />
  );
}
