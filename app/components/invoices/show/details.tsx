import { Card, Col, Row } from "react-bootstrap";
import FormattedId from "~/components/formatted-id";
import { formatDisplayDate } from "~/utility/formatters";
import useInvoicesShow from "~/hooks/invoices/use-show";
import Skeleton from "~/components/skeleton";
import ItemsTable from "./items-table";

export const InvoicesDetails = () => {
  const invoicesShow = useInvoicesShow();
  const { invoice, isLoading } = invoicesShow;

  const total = invoice?.items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  return (
    <Card>
      <Card.Body className="p-md-5">
        <Row className="d-md-flex justify-content-between mb-3">
          <Col xl={9}>
            <FormattedId id={invoice?.id} size="lg"></FormattedId>
            <div className="clearfix mb-1"></div>
            <p className="text-truncate">
              {invoice?.description ?? <Skeleton className="w-9" />}
            </p>
          </Col>
          <Col xl={3}>
            <address className="text-md-end text-truncate">
              <span>{invoice?.sender_street ?? <Skeleton />}</span>
              <br />
              <span>
                {invoice?.sender_city ?? <Skeleton className="w-7" />}
              </span>
              <br />
              <span>
                {invoice?.sender_postcode ?? <Skeleton className="w-6" />}
              </span>
              <br />
              <span>{invoice?.sender_country ?? <Skeleton />}</span>
            </address>
          </Col>
        </Row>
        <dl className="mb-5">
          <Row>
            <Col xs={{ span: 6 }} md={{ span: 4 }}>
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
            </Col>
            <Col xs={6} md={4}>
              <dt>Bill To</dt>
              <dd>
                <address className="text-truncate">
                  <span className="text-body-emphasis fw-medium">
                    {invoice?.client_name ?? <Skeleton />}
                  </span>
                  <br />
                  <span>{invoice?.client_street ?? <Skeleton />}</span>
                  <br />
                  <span>
                    {invoice?.client_city ?? <Skeleton className="w-7" />}
                  </span>
                  <br />
                  <span>
                    {invoice?.client_postcode ?? <Skeleton className="w-6" />}
                  </span>
                  <br />
                  <span>{invoice?.client_country ?? <Skeleton />}</span>
                </address>
              </dd>
            </Col>
            <Col md={4}>
              <dt>Sent To</dt>
              <dd>
                <span className="fw-medium text-body-emphasis text-truncate d-block">
                  {invoice?.client_email ?? <Skeleton className="w-9" />}
                </span>
              </dd>
            </Col>
          </Row>
        </dl>
        <ItemsTable invoice={invoice} total={total} isLoading={isLoading} />
      </Card.Body>
    </Card>
  );
};

export default InvoicesDetails;
