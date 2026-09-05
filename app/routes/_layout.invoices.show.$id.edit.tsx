import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { useNavigate, useOutletContext } from "@remix-run/react";
import { useEffect } from "react";
import InvoicesModalForm from "~/components/invoices/modal-form";
import useInvoicesEditModalForm from "~/hooks/invoices/use-edit-modal-form";
import type { InvoicesShow } from "~/hooks/invoices/use-show";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "/invoice-form.css" },
];

export const meta: MetaFunction = ({ params }) => [
  { title: `#${params.id} Edit Invoice | Invoicer` },
  {
    name: "description",
    content: "Create, manage, and send professional invoices with Invoicer.",
  },
];

export default function InvoiceEdit() {
  const navigate = useNavigate();
  const { invoice, isLoading } = useOutletContext<InvoicesShow>();
  const form = useInvoicesEditModalForm(
    isLoading,
    invoice,
    invoice?.id,
    () => navigate("..")
  );

  useEffect(() => {
    form.modal.show();
  }, [form.modal]);

  return (
    <InvoicesModalForm
      title={
        <>
          Edit <span className="text-muted">#</span>
          {invoice?.id}
        </>
      }
      invoicesModalForm={{
        ...form,
        modal: { ...form.modal, close: () => navigate("..") },
      }}
    />
  );
}
