import { ReactNode, createContext, useState } from "react";
import { Enums } from "~/types/supabase";

export interface FilterPaginationContextType {
  currentPage: number;
  pageSize: number;
  filters: Enums<"status">[];
  setCurrentPage: (page: number) => void;
  setPageSize: (value: number) => void;
  setFilters: (filters: Enums<"status">[]) => void;
}

const FilterPaginationContext = createContext<
  FilterPaginationContextType | undefined
>(undefined);

const FilterPaginationProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filters, setFilters] = useState<Enums<"status">[]>([]);

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const handleFiltersChange = (value: Enums<"status">[]) => {
    setFilters(value);
    setCurrentPage(1);
  };

  return (
    <FilterPaginationContext.Provider
      value={{
        currentPage,
        pageSize,
        filters,
        setCurrentPage,
        setPageSize: handlePageSizeChange,
        setFilters: handleFiltersChange,
      }}
    >
      {children}
    </FilterPaginationContext.Provider>
  );
};

export { FilterPaginationProvider, FilterPaginationContext };
