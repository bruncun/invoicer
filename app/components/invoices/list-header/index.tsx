import { Stack, Dropdown, Form, Button } from "react-bootstrap";
import Icon from "~/components/icon";
import { STATUSES } from "~/constants";
import { Status } from "~/types/invoices";

type InvoiceListHeaderProps = {
  modalShow: () => void;
  setFilters: (filters: Status[]) => void;
  filters: Status[];
};

export const InvoicesListHeader = ({
  modalShow,
  setFilters,
  filters,
}: InvoiceListHeaderProps) => {
  const handleStatusChange = (status: Status, checked: boolean) => {
    if (checked) {
      setFilters([...filters, status]);
    } else {
      setFilters(filters.filter((filter) => filter !== status));
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center">
      <h1 className="fs-4 fs-lg-3 mb-0 lh-1">Invoices</h1>
      <Stack direction="horizontal" gap={2}>
        <Dropdown>
          <Dropdown.Toggle variant="link">
            Filter
            <span className="d-none d-lg-inline-block">&nbsp;by Status</span>
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
          <span className="d-none d-lg-inline-block">Invoice</span>
        </Button>
      </Stack>
    </div>
  );
};
