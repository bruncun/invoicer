import { CSSProperties } from "react";
import { Badge } from "react-bootstrap";

type SkeletonProps = {
  className?: string;
  style?: CSSProperties;
  bg?: string;
};

const Skeleton = ({
  style = { height: "1.25rem" },
  className = "w-8",
  bg = "body-secondary",
}: SkeletonProps) => (
  <Badge bg={bg} className={`d-inline-block ${className}`} style={style}>
    &nbsp;
  </Badge>
);

export default Skeleton;
