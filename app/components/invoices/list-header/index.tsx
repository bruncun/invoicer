import { Stack, Dropdown, Form, Button } from "react-bootstrap";
import Icon from "~/components/icon";
import { STATUSES } from "~/constants";
import { InvoicesList } from "~/hooks/invoices/use-invoices-list";
import { Status } from "~/types/invoices";

type InvoiceListHeaderProps = {
  modalShow: () => void;
  invoicesList: InvoicesList;
};

export const InvoicesListHeader = ({
  modalShow,
  invoicesList: { data, isLoading, filters, setFilters },
}: InvoiceListHeaderProps) => {
  const invoices = data?.data;
  const handleStatusChange = (status: Status, checked: boolean) =>
    checked
      ? setFilters([...filters, status])
      : setFilters(filters.filter((filter) => filter !== status));

  return (
    <div className="d-flex justify-content-between align-items-center">
      <h1 className="fs-4 mb-0 lh-1">Invoices</h1>
      <Stack direction="horizontal" gap={2}>
        <Dropdown>
          <Dropdown.Toggle
            variant="link"
            disabled={invoices?.length === 0 || isLoading}
            className="user-select-none"
          >
            Filter
            <span className="d-none d-xl-inline-block">&nbsp;by Status</span>
            <Icon name="chevron-down text-primary ms-2"></Icon>
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
        <Button onClick={() => modalShow()}>
          <Icon name="plus-circle-fill" className="me-2"></Icon>New{" "}
          <span className="d-none d-xl-inline-block">Invoice</span>
        </Button>
      </Stack>
    </div>
  );
};
