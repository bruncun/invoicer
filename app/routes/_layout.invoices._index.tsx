import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { dataProvider } from "@refinedev/supabase";
import InvoicesModalForm from "~/components/invoices/modal-form";
import useInvoicesCreateModalForm from "~/hooks/invoices/use-create-modal-form";
import { InvoicesListHeader } from "~/components/invoices/list/list-header";
import InvoicesPager from "~/components/invoices/list/pager";
import { InvoicesListGroup } from "~/components/invoices/list/list-group";
import { createSupabaseServerClient } from "~/utility/supabase/server";
import { STATUSES } from "~/constants";
import type { Invoice } from "~/hooks/invoices/use-invoices-list";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);
  const result = await dataProvider(client).getList<Invoice>({
    resource: "invoices",
    pagination: { current: 1, pageSize: 10 },
    filters: [{ field: "status", operator: "in", value: STATUSES }],
    sorters: [{ field: "payment_due", order: "asc" }],
    meta: { select: "*, items(*)" },
  });

  return json({ initialData: result }, { headers: headers() });
}

export const InvoiceList = () => {
  const { initialData } = useLoaderData<typeof loader>();
  const invoicesCreateModalForm = useInvoicesCreateModalForm();
  const {
    modal: { show },
  } = invoicesCreateModalForm;

  return (
    <>
      <InvoicesListHeader modalShow={show} initialData={initialData} />
      <InvoicesListGroup initialData={initialData} />
      <InvoicesPager initialData={initialData} />
      <InvoicesModalForm
        title="New Invoice"
        invoicesModalForm={invoicesCreateModalForm}
      />
    </>
  );
};

export default InvoiceList;
