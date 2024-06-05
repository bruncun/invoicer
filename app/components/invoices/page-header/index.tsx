import { useNavigation } from "@refinedev/core";
import { Stack, Dropdown, Form, Button } from "react-bootstrap";
import { Icon } from "~/components/icon";

export const InvoicesPageHeader = ({
  count,
  filters,
  setFilters,
  modalShow,
}: {
  count?: number;
  filters: string[];
  setFilters: React.Dispatch<React.SetStateAction<string[]>>;
  modalShow: () => void;
}) => {
  const { createUrl } = useNavigation();

  const handleStatusChange = (status: string, checked: boolean) => {
    if (checked) {
      setFilters([...filters, status]);
    } else {
      setFilters(filters.filter((filter) => filter !== status));
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center">
      <h1 className="fs-4 fs-lg-3 mb-0 lh-1">
        Invoices{" "}
        <span className="text-muted fw-normal fs-5 fs-lg-4" data-testid="count">
          ({count})
        </span>
      </h1>
      <Stack direction="horizontal" gap={2}>
        <Dropdown>
          <Dropdown.Toggle variant="link">
            Filter
            <span className="d-none d-lg-inline-block">&nbsp;by Status</span>
            <Icon name="chevron-down ms-2"></Icon>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Form className="px-3 py-2">
              {["draft", "pending", "paid"].map((status) => (
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
          className="d-none d-lg-inline-block"
          onClick={() => modalShow()}
        >
          <Icon name="plus-circle-fill" className="me-2"></Icon>New Invoice
        </Button>
      </Stack>
    </div>
  );
};
