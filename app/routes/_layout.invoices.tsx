import { defer, type LoaderFunctionArgs } from "@remix-run/node";
import {
  Await,
  Outlet,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { Suspense } from "react";
import { dataProvider } from "~/utility/supabase/data-provider.server";
import { createSupabaseServerClient } from "~/utility/supabase/server";
import { STATUSES } from "~/constants/constants";
import type { Invoice } from "~/hooks/invoices/use-invoices-list";
import { InvoicesListHeader } from "~/components/invoices/list/list-header";
import InvoicesPager, {
  InvoicesPagerSkeleton,
} from "~/components/invoices/list/pager";
import {
  InvoicesListGroup,
  InvoicesListSkeleton,
} from "~/components/invoices/list/list-group";
import useInvoicesList from "~/hooks/invoices/use-invoices-list";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);
  const result = dataProvider(client, request).getList<Invoice>({
    resource: "invoices",
    pagination: { currentPage: 1, pageSize: 10 },
    filters: [{ field: "status", operator: "in", value: STATUSES }],
    sorters: [{ field: "payment_due", order: "asc" }],
    meta: {
      select: "id, description, payment_due, client_name, status, items(quantity, price)",
    },
  });

  return defer({ initialData: result }, { headers: headers() });
}

export default function InvoicesLayout() {
  const { initialData } = useLoaderData<typeof loader>();
  const { pathname } = useLocation();
  const isListRoute =
    pathname === "/invoices" || pathname === "/invoices/create";

  return (
    <>
      {isListRoute && (
        <>
          <InvoicesListHeader />
          <Suspense
            fallback={
              <>
                <InvoicesListSkeleton />
                <InvoicesPagerSkeleton />
              </>
            }
          >
            <Await resolve={initialData}>
              {(data) => (
                <InvoicesListContent
                  initialData={data}
                />
              )}
            </Await>
          </Suspense>
        </>
      )}
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
      <InvoicesListGroup invoicesList={invoicesList} />
      <InvoicesPager invoicesList={invoicesList} />
    </>
  );
}
