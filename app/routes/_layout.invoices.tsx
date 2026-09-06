import { defer, type LoaderFunctionArgs } from "@remix-run/node";
import {
  Await,
  Outlet,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { lazy, Suspense } from "react";
import { FilterPaginationProvider } from "~/contexts/invoices/filter-pagination";
import { dataProvider } from "~/utility/supabase/data-provider.server";
import { createSupabaseServerClient } from "~/utility/supabase/server";
import { STATUSES } from "~/constants/constants";
import type { Invoice } from "~/hooks/invoices/use-invoices-list";
import { InvoicesListHeader } from "~/components/invoices/list/list-header";
import { InvoicesListLoadingState } from "~/components/invoices/list/loading-state";

const LazyRefineProvider = lazy(() => import("~/components/refine-provider"));
const LazyInvoicesListContent = lazy(
  () => import("~/components/invoices/list/content")
);

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
    <FilterPaginationProvider>
      {isListRoute && <InvoicesListHeader />}
      <Suspense
        fallback={
          isListRoute ? (
            <InvoicesListLoadingState />
          ) : null
        }
      >
        <LazyRefineProvider>
          {isListRoute && (
            <Await resolve={initialData}>
              {(data) => <LazyInvoicesListContent initialData={data} />}
            </Await>
          )}
          <Outlet />
        </LazyRefineProvider>
      </Suspense>
    </FilterPaginationProvider>
  );
}
