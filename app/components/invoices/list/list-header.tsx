import { lazy, Suspense, useCallback, useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "@remix-run/react";
import Icon from "~/components/icon";
import { loadDropdownStyles } from "./load-dropdown-styles";

let filterDropdownPromise: Promise<typeof import("./filter-dropdown")> | undefined;

const loadFilterDropdown = () =>
  (filterDropdownPromise ??= Promise.all([
    import("./filter-dropdown"),
    loadDropdownStyles(),
  ]).then(([module]) => module));

const LazyFilterDropdown = lazy(loadFilterDropdown);

export const InvoicesListHeader = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const prepareFilter = useCallback(() => {
    void loadFilterDropdown();
  }, []);
  const openFilter = useCallback(() => {
    prepareFilter();
    setIsFilterOpen(true);
  }, [prepareFilter]);

  return (
    <div className="d-flex justify-content-between align-items-center">
      <h1 className="fs-4 mb-0 lh-1">Invoices</h1>
      <div className="hstack gap-2">
        {isFilterOpen ? (
          <Suspense fallback={<FilterButton onIntent={prepareFilter} onClick={openFilter} />}>
            <LazyFilterDropdown
              show={isFilterOpen}
              onShowChange={setIsFilterOpen}
              onIntent={prepareFilter}
            />
          </Suspense>
        ) : (
          <FilterButton onIntent={prepareFilter} onClick={openFilter} />
        )}
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
      </div>
    </div>
  );
};

function FilterButton({
  onIntent,
  onClick,
}: {
  onIntent: () => void;
  onClick: () => void;
}) {
  return (
    <Button
      variant="link"
      className="user-select-none text-nowrap"
      aria-haspopup="menu"
      aria-expanded={false}
      onPointerEnter={onIntent}
      onFocus={onIntent}
      onClick={onClick}
    >
      Filter
      <span className="d-none d-sm-inline-block">&nbsp;by Status</span>
      <Icon name="chevron-down ms-2" aria-hidden="true" />
    </Button>
  );
}
