import { Badge, Card, Col, Row, Stack, Table } from "react-bootstrap";
import FormattedId from "~/components/formatted-id";
import { formatDisplayDate, formatCurrency } from "~/utility/formatters";
import useInvoicesShow from "~/hooks/invoices/use-show";
import Skeleton from "~/components/skeleton";
import { Tables } from "~/types/supabase";
import { Invoice } from "~/types/invoices";

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
        <div className="d-md-flex justify-content-between mb-3">
          <div>
            <FormattedId id={invoice?.id} size="lg"></FormattedId>
            <div className="clearfix mb-1"></div>
            <p>{invoice?.description ?? <Skeleton className="w-9" />}</p>
          </div>
          <address className="text-md-end">
            <span>{invoice?.sender_street ?? <Skeleton />}</span>
            <br />
            <span>{invoice?.sender_city ?? <Skeleton className="w-7" />}</span>
            <br />
            <span>
              {invoice?.sender_postcode ?? <Skeleton className="w-6" />}
            </span>
            <br />
            <span>{invoice?.sender_country ?? <Skeleton />}</span>
          </address>
        </div>
        <dl className="mb-5">
          <Row>
            <Col xs={{ span: 6 }} md={{ span: 4 }}>
              <dt>Invoice Date</dt>
              <dd className="mb-4 text-body-emphasis fw-semibold">
                {(invoice && formatDisplayDate(invoice?.created_at)) ?? (
                  <Skeleton className="w-7" />
                )}
              </dd>
              <dt>Payment Due</dt>
              <dd className="text-body-emphasis fw-semibold">
                {(invoice && formatDisplayDate(invoice?.payment_due)) ?? (
                  <Skeleton className="w-7" />
                )}
              </dd>
            </Col>
            <Col xs={{ span: 6 }} md={{ span: 4 }}>
              <dt>Bill To</dt>
              <dd>
                <span className="text-body-emphasis fw-semibold">
                  {invoice?.client_name ?? <Skeleton />}
                </span>
                <br />
                <address>
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
            <Col>
              <dt>Sent To</dt>
              <dd>
                <span className="fw-semibold text-body-emphasis">
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

interface ItemsTableProps {
  invoice?: Invoice;
  total?: number;
  isLoading: boolean;
}

interface ItemListItemProps {
  item?: Tables<"items">;
}

const ItemsTable = ({ invoice, total, isLoading }: ItemsTableProps) => {
  return (
    <>
      <Card bg="body-secondary" className="rounded-bottom-0">
        <Card.Body>
          <Table
            className="d-none d-md-table text-body-tertiary"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr>
                <th>Item Name</th>
                <th className="text-center">QTY.</th>
                <th className="text-end">Price</th>
                <th className="text-end">Total</th>
              </tr>
            </thead>
            <tbody className="fw-semibold">
              {isLoading
                ? new Array(10)
                    .fill(0)
                    .map((item, index) => (
                      <ItemListItem key={index} item={item} />
                    ))
                : invoice?.items.map((item, index) => (
                    <ItemListItem key={index} item={item} />
                  ))}
            </tbody>
          </Table>
          <Stack direction="vertical" gap={3} className="d-md-none">
            {invoice?.items.map((item, index) => (
              <div
                key={index}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <span className="fw-semibold text-body-emphasis d-block">
                    {item.name}
                  </span>
                  <span>
                    {item.quantity} x {formatCurrency(item.price)}
                  </span>
                </div>
                <span>{formatCurrency(item.quantity * item.price)}</span>
              </div>
            ))}
          </Stack>
        </Card.Body>
      </Card>
      <Card bg="secondary" className="rounded-top-0 mb-6 mb-md-0 text-white">
        <Card.Body className="px-xl-4 mx-xl-2">
          <div className="d-flex justify-content-between align-items-center">
            <span className="mb-0">Amount Due</span>
            {(total && (
              <span className="fw-semibold fs-4">{formatCurrency(total)}</span>
            )) ?? (
              <Skeleton
                bg="white"
                className="w-7"
                style={{ height: "2.25rem" }}
              />
            )}
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export const ItemListItem: React.FC<ItemListItemProps> = ({ item }) => {
  let formattedTotal, formattedPrice;

  if (item) {
    formattedPrice = formatCurrency(item.price);
    formattedTotal = formatCurrency(item.quantity * item.price);
  }

  return (
    <tr>
      <td className="align-top text-body-emphasis fw-semibold">
        {item?.name ?? <Skeleton bg="secondary" />}
      </td>
      <td className="text-center">
        {item?.quantity ?? <Skeleton bg="secondary" className="w-3" />}
      </td>
      <td className="align-top text-end">
        {formattedPrice ?? <Skeleton bg="secondary" className="w-6" />}
      </td>
      <td className="align-top text-body-emphasis fw-semibold text-end">
        {formattedTotal ?? <Skeleton bg="secondary" className="w-7" />}
      </td>
    </tr>
  );
};

export default InvoicesDetails;
