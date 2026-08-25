import { BaseKey, useUpdate } from "@refinedev/core";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { dataProvider } from "@refinedev/supabase";
import InvoicesModalForm from "~/components/invoices/modal-form";
import InvoicesDetails from "~/components/invoices/show/details";
import InvoicesDetailsHeader from "~/components/invoices/show/details-header";
import useInvoicesEditModalForm from "~/hooks/invoices/use-edit-modal-form";
import InvoicesConfirmDeletionModal from "~/components/invoices/show/confirm-deletion-modal";
import useInvoicesShow from "~/hooks/invoices/use-show";
import { useState } from "react";
import { supabaseClient } from "~/utility/supabase";
import { createSupabaseServerClient } from "~/utility/supabase/server";
import InvoicesShowMobileNavbar from "~/components/invoices/show/mobile-navbar";
import type { Invoice } from "~/hooks/invoices/use-invoices-list";

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (!params.id) throw new Response("Invoice ID is required", { status: 400 });

  const { client, headers } = createSupabaseServerClient(request);
  const result = await dataProvider(client).getOne<Invoice>({
    resource: "invoices",
    id: params.id,
    meta: { select: "*, items(*)" },
  });

  return json(result, { headers: headers() });
}

export const InvoicesShow = () => {
  const initialData = useLoaderData<typeof loader>() as {
    data: Invoice;
  };
  const { invoice, isLoading: isInvoicesLoading } = useInvoicesShow(initialData);
  const invoicesModalEditForm = useInvoicesEditModalForm(
    isInvoicesLoading,
    invoice
  );
  const {
    modal: { show },
  } = invoicesModalEditForm;
  const { mutateAsync: mutateUpdateAsync } = useUpdate();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const onUpdateStatus = async (status: "paid" | "pending") => {
    setIsUpdateLoading(true);
    if (status === "pending") {
      await supabaseClient.functions.invoke("send-invoice", {
        body: invoice,
      });
    }
    mutateUpdateAsync({
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
        modalShow={show}
        onUpdateStatus={onUpdateStatus}
        isUpdateLoading={isUpdateLoading}
        setShowConfirmationModal={setShowConfirmationModal}
        showConfirmationModal={showConfirmationModal}
      />
      <InvoicesDetails />
      <InvoicesShowMobileNavbar
        modalShow={show}
        onUpdateStatus={onUpdateStatus}
        isUpdateLoading={isUpdateLoading}
        setShowConfirmationModal={setShowConfirmationModal}
        showConfirmationModal={showConfirmationModal}
      />
      <InvoicesModalForm
        title={
          <>
            Edit <span className="text-muted">#</span>
            {invoice?.id}
          </>
        }
        invoicesModalForm={invoicesModalEditForm}
      />
      <InvoicesConfirmDeletionModal
        show={showConfirmationModal}
        setShowConfirmationModal={setShowConfirmationModal}
      />
    </>
  );
};

export default InvoicesShow;
