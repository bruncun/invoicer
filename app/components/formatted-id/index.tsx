import Skeleton from "../skeleton";

type FormattedIdProps = {
  id?: number;
  className?: string;
};

const FormattedId = ({ id, className }: FormattedIdProps) => {
  return (
    <span
      className={`fw-semibold text-muted d-flex align-items-center ${
        className ? className : ""
      }`}
    >
      {id ? (
        <>
          #<span className="text-body-emphasis">{id}</span>
        </>
      ) : (
        <Skeleton className="w-5" />
      )}
    </span>
  );
};

export default FormattedId;
