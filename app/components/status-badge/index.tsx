import Icon from "../icon";
import Skeleton from "../skeleton";

type StatusBadgeProps = {
  status?: string;
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  let badgeColor;
  if (status) {
    badgeColor = {
      draft: "secondary",
      pending: "warning",
      paid: "success",
    }[status];
  }

  if (!status)
    return (
      <Skeleton className="d-inline-block w-8" style={{ height: "2.625rem" }} />
    );

  return (
    <span
      className={`badge bg-${badgeColor}-subtle text-${badgeColor}-emphasis fs-6 text-capitalize d-flex align-items-center justify-content-center w-8`}
    >
      <Icon
        name="circle-fill"
        className="me-2"
        style={{ fontSize: "0.375rem" }}
        aria-hidden="true"
      ></Icon>
      {status}
    </span>
  );
};
