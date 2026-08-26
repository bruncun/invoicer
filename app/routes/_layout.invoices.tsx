import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { dataProvider } from "~/utility/supabase/data-provider.server";
import { createSupabaseServerClient } from "~/utility/supabase/server";
import { STATUSES } from "~/constants";
import type { Invoice } from "~/hooks/invoices/use-invoices-list";
import { InvoicesListHeader } from "~/components/invoices/list/list-header";
import InvoicesPager from "~/components/invoices/list/pager";
import { InvoicesListGroup } from "~/components/invoices/list/list-group";
import useInvoicesList from "~/hooks/invoices/use-invoices-list";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);
  const result = await dataProvider(client, request).getList<Invoice>({
    resource: "invoices",
    pagination: { currentPage: 1, pageSize: 10 },
    filters: [{ field: "status", operator: "in", value: STATUSES }],
    sorters: [{ field: "payment_due", order: "asc" }],
    meta: {
      select: "id, description, payment_due, client_name, status, items(quantity, price)",
    },
  });

  return json({ initialData: result }, { headers: headers() });
}

export default function InvoicesLayout() {
  const { initialData } = useLoaderData<typeof loader>();
  const { pathname } = useLocation();
  const isListRoute =
    pathname === "/invoices" || pathname === "/invoices/create";

  return (
    <>
      {isListRoute && <InvoicesListContent initialData={initialData} />}
      <Outlet />
    </>
  );
}

function InvoicesListContent({
  initialData,
}: {
  initialData: Parameters<typeof useInvoicesList>[0];
}) {
  const invoicesList = useInvoicesList(initialData);

  return (
    <>
      <InvoicesListHeader invoicesList={invoicesList} />
      <InvoicesListGroup invoicesList={invoicesList} />
      <InvoicesPager invoicesList={invoicesList} />
    </>
  );
}
