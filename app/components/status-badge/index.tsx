import { Badge } from "react-bootstrap";
import Icon from "../icon";

export const StatusBadge = ({ status }: { status: string }) => {
  const badgeColor = {
    draft: "secondary",
    pending: "warning",
    paid: "success",
  }[status];

  return (
    <Badge
      bg={`${badgeColor}-subtle`}
      className={`text-${badgeColor}-emphasis fs-6 text-capitalize d-flex align-items-center justify-content-center`}
      style={{ minWidth: "7rem" }}
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
