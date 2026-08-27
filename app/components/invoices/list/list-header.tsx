import { Stack, Dropdown, Form, Button } from "react-bootstrap";
import { Link } from "@remix-run/react";
import Icon from "~/components/icon";
import { STATUSES } from "~/constants";
import { Enums } from "~/types/supabase";
import useFilterPagination from "~/hooks/invoices/use-filter-pagination";
import type { Invoice } from "~/hooks/invoices/use-invoices-list";

type InvoiceListHeaderProps = {
  invoices?: Invoice[];
  isPending?: boolean;
};

export const InvoicesListHeader = ({
  invoices = [],
  isPending = false,
}: InvoiceListHeaderProps) => {
  const { filters, setFilters } = useFilterPagination();
  const handleStatusChange = (status: Enums<"status">, checked: boolean) =>
    checked
      ? setFilters([...filters, status])
      : setFilters(filters.filter((filter) => filter !== status));

  return (
    <div className="d-flex justify-content-between align-items-center">
      <h1 className="fs-4 mb-0 lh-1">Invoices</h1>
      <Stack direction="horizontal" gap={2}>
        <Dropdown focusFirstItemOnShow>
          <Dropdown.Toggle
            variant="link"
            disabled={isPending}
            className="user-select-none"
          >
            Filter
            <span className="d-none d-sm-inline-block">&nbsp;by Status</span>
            <Icon name="chevron-down ms-2" aria-hidden="true"></Icon>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Form className="px-3 py-2">
              {STATUSES.map((status) => (
                <Form.Check
                  key={status}
                  label={status.charAt(0).toUpperCase() + status.slice(1)}
                  id={status}
                  value={status}
                  checked={filters.includes(status)}
                  onChange={({ target: { checked } }) =>
                    handleStatusChange(status, checked)
                  }
                ></Form.Check>
              ))}
            </Form>
          </Dropdown.Menu>
        </Dropdown>
        <Button
          as={Link}
          to="/invoices/create"
          prefetch="intent"
          className="position-relative"
        >
          <Icon
            name="plus-circle-fill"
            className="me-2 position-absolute fs-4 start-0 top-0 ms-2 mt-0"
            aria-hidden="true"
          ></Icon>
          <span className="ms-4 ps-1">New </span>
          <span className="d-none d-sm-inline-block">Invoice</span>
        </Button>
      </Stack>
    </div>
  );
};
