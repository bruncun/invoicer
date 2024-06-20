import { Badge } from "react-bootstrap";
import Icon from "../icon";

type StatusBadgeProps = {
  status?: string;
  isLoading: boolean;
};

export const StatusBadge = ({ status, isLoading }: StatusBadgeProps) => {
  let badgeColor;
  if (status) {
    badgeColor = {
      draft: "secondary",
      pending: "warning",
      paid: "success",
    }[status];
  }

  if (isLoading)
    return (
      <Badge
        bg="light"
        className="d-inline-block w-8"
        style={{ height: "2.5rem" }}
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
