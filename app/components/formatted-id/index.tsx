import Skeleton from "../skeleton";

type FormattedIdProps = {
  id?: number;
  className?: string;
  size?: string;
};

const FormattedId = ({ id, className, size }: FormattedIdProps) => {
  return (
    <span
      className={`fw-medium text-muted d-flex align-items-center lh-1 ${
        className ? className : ""
      } ${size === "lg" ? "fs-5" : ""}`}
      style={{ height: "1.25rem" }}
    >
      {id ? (
        <>
          #<span className="text-body-emphasis">{id}</span>
        </>
      ) : (
        <Skeleton
          className="w-6"
          {...(size === "lg" ? { style: { height: "1.125rem" } } : {})}
        />
      )}
    </span>
  );
};

export default FormattedId;
