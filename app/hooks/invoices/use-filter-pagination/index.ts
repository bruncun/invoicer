import { useContext } from "react";
import { FilterPaginationContext } from "~/contexts/invoices/filter-pagination";

const useFilterPagination = () => {
  const context = useContext(FilterPaginationContext);
  if (!context) {
    throw new Error(
      "useFilterPagination must be used within a FilterPaginationProvider"
    );
  }
  return context;
};

export default useFilterPagination;
