import { Button } from "react-bootstrap";
import { InvoicesList } from "~/hooks/invoices/use-invoices-list";
import Icon from "~/components/icon";
import MobileNavbar from "~/components/ui/mobile-navbar";

type InvoicesListMobileNavbarProps = {
  invoicesList: InvoicesList;
};

const InvoicesListMobileNavbar = ({
  invoicesList: { currentPage, setCurrentPage, pageSize, data, isLoading },
}: InvoicesListMobileNavbarProps) => {
  const total = data?.total ?? 0;
  const isNextPageAvailable = total >= pageSize * currentPage + 1;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (total === 0 && !isLoading) return null;

  return (
    <MobileNavbar>
      <div className="d-flex justify-content-between w-100 d-xl-inline-block w-xl-auto">
        <Button
          variant="link"
          className="rounded-3 user-select-none"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
        >
          <Icon name="arrow-left me-2" />
          Previous
        </Button>
        <Button
          variant="link"
          className="rounded-3 user-select-none"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!isNextPageAvailable || isLoading}
        >
          Next
          <Icon name="arrow-right ms-2" />
        </Button>
      </div>
    </MobileNavbar>
  );
};

export default InvoicesListMobileNavbar;
