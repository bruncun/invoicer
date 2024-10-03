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

  return (
    <FilterPaginationContext.Provider
      value={{
        currentPage,
        pageSize,
        filters,
        setCurrentPage,
        setPageSize,
        setFilters,
      }}
    >
      {children}
    </FilterPaginationContext.Provider>
  );
};

export { FilterPaginationProvider, FilterPaginationContext };
