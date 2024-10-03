import { Badge } from "react-bootstrap";
import Icon from "../icon";

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
      <Badge
        bg="body-secondary"
        className="d-inline-block w-8"
        style={{ height: "2.625rem" }}
      >
        &nbsp;
      </Badge>
    );

  return (
    <Badge
      bg={`${badgeColor}-subtle`}
      className={`text-${badgeColor}-emphasis fs-6 text-capitalize d-flex align-items-center justify-content-center w-8`}
    >
      <Icon
        name="circle-fill"
        className="me-2"
        style={{ fontSize: "0.375rem" }}
      ></Icon>
      {status}
    </Badge>
  );
};
