type FormattedIdProps = {
  id: number;
  className?: string;
};

const FormattedId = ({ id, className }: FormattedIdProps) => (
  <span className={`fw-semibold text-muted ${className ? className : ""}`}>
    #<span className="text-body-emphasis">{id}</span>
  </span>
);

export default FormattedId;
