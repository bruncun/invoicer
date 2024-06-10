import { Card, Col, Row, Stack, Table } from "react-bootstrap";
import FormattedId from "~/components/formatted-id";
import { formatDisplayDate, formatCurrency } from "~/utility/formatters";
import { InvoiceWithRelated } from "~/types/invoices";

export const InvoicesDetails = ({
  invoice,
}: {
  invoice?: InvoiceWithRelated;
}) => {
  const total = invoice?.items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  return (
    <Card>
      <Card.Body className="p-md-5">
        <div className="d-md-flex justify-content-between">
          <div>
            <FormattedId id={invoice?.id}></FormattedId>
            <div className="clearfix"></div>
            <p>{invoice?.description}</p>
          </div>
          <div className="text-md-end">
            <span className="d-block">{invoice?.sender_street}</span>
            <span className="d-block">{invoice?.sender_city}</span>
            <span className="d-block">{invoice?.sender_postcode}</span>
            <span className="d-block mb-3">{invoice?.sender_country}</span>
          </div>
        </div>
        <dl className="mb-5">
          <Row>
            <Col xs={{ span: 6 }} md={{ span: 4 }}>
              <dt>Invoice Date</dt>
              <dd className="mb-4 text-body-emphasis fw-semibold">
                {invoice && formatDisplayDate(invoice?.created_at)}
              </dd>
              <dt>Payment Due</dt>
              <dd className="text-body-emphasis fw-semibold">
                {invoice && formatDisplayDate(invoice?.payment_due)}
              </dd>
            </Col>
            <Col xs={{ span: 6 }} md={{ span: 4 }}>
              <dt>Bill To</dt>
              <dd>
                <span className="text-body-emphasis fw-semibold">
                  {invoice?.client_name}
                </span>
                <span className="d-block">{invoice?.client_street}</span>
                <span className="d-block">{invoice?.client_city}</span>
                <span className="d-block">{invoice?.client_postcode}</span>
                <span className="d-block">{invoice?.client_country}</span>
              </dd>
            </Col>
            <Col>
              <dt>Sent To</dt>
              <dd>
                <span className="fw-semibold text-body-emphasis">
                  {invoice?.client_email}
                </span>
              </dd>
            </Col>
          </Row>
        </dl>
        <Card bg="body-secondary" className="rounded-bottom-0">
          <Card.Body>
            <Table className="d-none d-md-table text-body-tertiary">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th className="text-end">QTY.</th>
                  <th className="text-end">Price</th>
                  <th className="text-end">Total</th>
                </tr>
              </thead>
              <tbody className="fw-semibold">
                {invoice?.items.map((item, index) => (
                  <tr key={index}>
                    <td className="text-body-emphasis fw-semibold">
                      {item.name}
                    </td>
                    <td className="text-end">{item.quantity}</td>
                    <td className="text-end">{formatCurrency(item.price)}</td>
                    <td className="text-body-emphasis fw-semibold text-end">
                      {formatCurrency(item.quantity * item.price)}
                    </td>
                  </tr>
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
          <Card.Body className="px-lg-4 mx-lg-2">
            <dl className="d-flex justify-content-between align-items-center">
              <dt>Amount Due</dt>
              <dd className="fw-semibold fs-4">
                {invoice && total && formatCurrency(total)}
              </dd>
            </dl>
          </Card.Body>
        </Card>
      </Card.Body>
    </Card>
  );
};

export default InvoicesDetails;
