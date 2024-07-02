import React, {
  PropsWithChildren,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";
import { Status } from "~/types/invoices";

export interface FilterPaginationContextType {
  currentPage: number;
  pageSize: number;
  filters: Status[];
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilters: (filters: Status[]) => void;
}

const FilterPaginationContext = createContext<
  FilterPaginationContextType | undefined
>(undefined);

const FilterPaginationProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filters, setFilters] = useState<Status[]>([]);

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
