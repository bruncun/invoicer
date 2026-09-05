import FormattedId from "~/components/formatted-id";
import { formatDisplayDate } from "~/utility/formatters";
import type { InvoicesShow } from "~/hooks/invoices/use-show";
import Skeleton from "~/components/skeleton";
import ItemsTable from "./items-table";

export const InvoicesDetails = ({ invoicesShow }: { invoicesShow: InvoicesShow }) => {
  const { invoice, isLoading } = invoicesShow;

  const total = invoice?.items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  return (
    <div className="card">
      <div className="card-body p-md-5">
        <div className="row d-md-flex justify-content-between mb-3">
          <div className="col-xl-9">
            <FormattedId id={invoice?.id} size="lg"></FormattedId>
            <div className="clearfix mb-1"></div>
            <p className="text-truncate">
              {invoice?.description ?? <Skeleton className="w-10" />}
            </p>
          </div>
          <div className="col-xl-3">
            <address className="text-md-end text-truncate">
              <span>
                {invoice?.sender_street ?? <Skeleton className="w-7" />}
              </span>
              <br />
              <span>
                {invoice?.sender_city ?? <Skeleton className="w-6" />}
              </span>
              <br />
              <span>
                {invoice?.sender_postcode ?? <Skeleton className="w-5" />}
              </span>
              <br />
              <span>
                {invoice?.sender_country ?? <Skeleton className="w-7" />}
              </span>
            </address>
          </div>
        </div>
        <dl className="mb-5">
          <div className="row">
            <div className="col-6 col-md-4">
              <dt>Invoice Date</dt>
              <dd className="mb-4 text-body-emphasis fw-medium">
                {(invoice && formatDisplayDate(invoice?.created_at)) ?? (
                  <Skeleton className="w-7" />
                )}
              </dd>
              <dt>Payment Due</dt>
              <dd className="text-body-emphasis fw-medium">
                {(invoice && formatDisplayDate(invoice?.payment_due)) ?? (
                  <Skeleton className="w-7" />
                )}
              </dd>
            </div>
            <div className="col-6 col-md-4">
              <dt>Bill To</dt>
              <dd>
                <address className="text-truncate">
                  <span className="text-body-emphasis fw-medium">
                    {invoice?.client_name ?? <Skeleton className="w-6" />}
                  </span>
                  <br />
                  <span>
                    {invoice?.client_street ?? <Skeleton className="w-7" />}
                  </span>
                  <br />
                  <span>
                    {invoice?.client_city ?? <Skeleton className="w-6" />}
                  </span>
                  <br />
                  <span>
                    {invoice?.client_postcode ?? <Skeleton className="w-5" />}
                  </span>
                  <br />
                  <span>
                    {invoice?.client_country ?? <Skeleton className="w-6" />}
                  </span>
                </address>
              </dd>
            </div>
            <div className="col-md-4">
              <dt>Sent To</dt>
              <dd>
                <span className="fw-medium text-body-emphasis text-truncate d-block">
                  {invoice?.client_email ?? <Skeleton className="w-10" />}
                </span>
              </dd>
            </div>
          </div>
        </dl>
        <ItemsTable invoice={invoice} total={total} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default InvoicesDetails;
