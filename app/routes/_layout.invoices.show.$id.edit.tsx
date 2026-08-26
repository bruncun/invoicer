import type { LinksFunction } from "@remix-run/node";
import { useNavigate, useRouteLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import InvoicesModalForm from "~/components/invoices/modal-form";
import useInvoicesEditModalForm from "~/hooks/invoices/use-edit-modal-form";
import useInvoicesShow from "~/hooks/invoices/use-show";
import type { Invoice } from "~/hooks/invoices/use-invoices-list";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "/invoice-form.css" },
];

export default function InvoiceEdit() {
  const navigate = useNavigate();
  const initialData = useRouteLoaderData(
    "routes/_layout.invoices.show.$id"
  ) as { data: Invoice };
  const { invoice, isLoading } = useInvoicesShow(initialData);
  const form = useInvoicesEditModalForm(isLoading, invoice, invoice?.id);

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
