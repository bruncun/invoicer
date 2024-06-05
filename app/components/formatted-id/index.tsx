type FormattedIdProps = {
  id: number;
  className?: string;
};

export const FormattedId = ({ id, className }: FormattedIdProps) => (
  <span className={`fw-semibold text-muted ${className ? className : ""}`}>
    #<span className="text-body-emphasis">{id}</span>
  </span>
);
