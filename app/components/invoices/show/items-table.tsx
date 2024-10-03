import { Card, Stack, Table } from "react-bootstrap";
import { formatCurrency } from "~/utility/formatters";
import Skeleton from "~/components/skeleton";
import { InferType } from "yup";
import { invoiceSchema } from "~/constants";
import ItemsRow from "./items-row";

interface ItemsTableProps {
  invoice?: InferType<typeof invoiceSchema>;
  total?: number;
  isLoading: boolean;
}

const ItemsTable = ({ invoice, total, isLoading }: ItemsTableProps) => (
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
              <th className="text-center">Quantity</th>
              <th className="text-end">Price</th>
              <th className="text-end">Total</th>
            </tr>
          </thead>
          <tbody className="fw-medium">
            {isLoading
              ? new Array(10)
                  .fill(0)
                  .map((item, index) => <ItemsRow key={index} item={item} />)
              : invoice?.items.map((item, index) => (
                  <ItemsRow key={index} item={item} />
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
                <span className="fw-medium text-body-emphasis d-block text-truncate w-10">
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
        <div className="d-flex justify-content-between align-items-center">
          <span className="mb-0">Amount Due</span>
          {(total && (
            <span className="fw-medium fs-4 text-truncate">
              {formatCurrency(total)}
            </span>
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

export default ItemsTable;
