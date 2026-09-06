import Select from "~/components/select";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100].map((size) => ({
  value: size.toString(),
  label: size.toString(),
}));

type RowsPerPageSelectProps = {
  pageSize: number;
  isLoading: boolean;
  onChange: (value: string) => void;
};

export default function RowsPerPageSelect({
  pageSize,
  isLoading,
  onChange,
}: RowsPerPageSelectProps) {
  return (
    <Select
      value={pageSize}
      onChange={onChange}
      options={PAGE_SIZE_OPTIONS}
      disabled={isLoading}
      drop="up"
      ariaLabel="Rows per page"
      buttonClassName="border-transparent rows-per-page-select"
      menuClassName="rows-per-page-menu"
      initiallyOpen
    />
  );
}
