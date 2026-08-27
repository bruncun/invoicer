import { BaseKey, useUpdate } from "@refinedev/core";
import { defer, type LoaderFunctionArgs } from "@remix-run/node";
import {
  Await,
  Outlet,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { dataProvider } from "~/utility/supabase/data-provider.server";
import InvoicesDetails from "~/components/invoices/show/details";
import InvoicesDetailsHeader from "~/components/invoices/show/details-header";
import InvoicesConfirmDeletionModal from "~/components/invoices/show/confirm-deletion-modal";
import useInvoicesShow from "~/hooks/invoices/use-show";
import type { InvoicesShow as InvoicesShowState } from "~/hooks/invoices/use-show";
import { Suspense, useState } from "react";
import { createSupabaseServerClient } from "~/utility/supabase/server";
import InvoicesShowMobileNavbar from "~/components/invoices/show/mobile-navbar";
import type { Invoice } from "~/hooks/invoices/use-invoices-list";

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (!params.id) throw new Response("Invoice ID is required", { status: 400 });

  const { client, headers } = createSupabaseServerClient(request);
  const result = dataProvider(client, request).getOne<Invoice>({
    resource: "invoices",
    id: params.id,
    meta: { select: "*, items(*)" },
  });

  return defer({ result }, { headers: headers() });
}

export const InvoicesShow = () => {
  const { result } = useLoaderData<typeof loader>();
  const { state } = useNavigation();

  return (
    <Suspense fallback={<InvoicesShowSkeleton />}>
      <Await resolve={result}>
        {(initialData) => (
          <InvoicesShowContent
            initialData={initialData as { data: Invoice }}
            isNavigationPending={state !== "idle"}
          />
        )}
      </Await>
    </Suspense>
  );
};

function InvoicesShowContent({
  initialData,
  isNavigationPending,
}: {
  initialData: { data: Invoice };
  isNavigationPending: boolean;
}) {
  const invoicesShow = useInvoicesShow(initialData, isNavigationPending);
  const { invoice } = invoicesShow;
  const { mutateAsync: mutateUpdateAsync } = useUpdate();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const onUpdateStatus = async (status: "paid" | "pending") => {
    setIsUpdateLoading(true);
    if (status === "pending") {
      await fetch("/api/invoices/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice),
      });
    }
    await mutateUpdateAsync({
      resource: "invoices",
      id: invoice?.id as BaseKey,
      values: {
        status,
      },
      successNotification: {
        type: "success",
        message: "success",
        description:
          status === "pending"
            ? "Invoice updated and sent"
            : "Invoice marked as paid",
      },
      mutationMode: "optimistic",
    });
    setIsUpdateLoading(false);
  };

  return (
    <>
      <InvoicesDetailsHeader
        invoicesShow={invoicesShow}
        editUrl={(id) => `/invoices/show/${id}/edit`}
        onUpdateStatus={onUpdateStatus}
        isUpdateLoading={isUpdateLoading}
        setShowConfirmationModal={setShowConfirmationModal}
        showConfirmationModal={showConfirmationModal}
      />
      <InvoicesDetails invoicesShow={invoicesShow} />
      <InvoicesShowMobileNavbar
        invoicesShow={invoicesShow}
        editUrl={(id) => `/invoices/show/${id}/edit`}
        onUpdateStatus={onUpdateStatus}
        isUpdateLoading={isUpdateLoading}
        setShowConfirmationModal={setShowConfirmationModal}
        showConfirmationModal={showConfirmationModal}
      />
      <InvoicesConfirmDeletionModal
        invoicesShow={invoicesShow}
        show={showConfirmationModal}
        setShowConfirmationModal={setShowConfirmationModal}
      />
      <Outlet context={invoicesShow} />
    </>
  );
};

function InvoicesShowSkeleton() {
  const invoicesShow: InvoicesShowState = {
    invoice: undefined,
    isLoading: true,
    isError: false,
  };

  return (
    <>
      <InvoicesDetailsHeader
        invoicesShow={invoicesShow}
        editUrl={() => ""}
        onUpdateStatus={() => undefined}
        isUpdateLoading={false}
        setShowConfirmationModal={() => undefined}
        showConfirmationModal={false}
      />
      <InvoicesDetails invoicesShow={invoicesShow} />
      <InvoicesShowMobileNavbar
        invoicesShow={invoicesShow}
        editUrl={() => ""}
        onUpdateStatus={() => undefined}
        isUpdateLoading={false}
        setShowConfirmationModal={() => undefined}
        showConfirmationModal={false}
      />
    </>
  );
}

export default InvoicesShow;
