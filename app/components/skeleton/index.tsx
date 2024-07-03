import { CSSProperties } from "react";
import { Badge, Placeholder } from "react-bootstrap";

type SkeletonProps = {
  className?: string;
  style?: CSSProperties;
  bg?: string;
};

const Skeleton = ({
  style = { height: "1rem" },
  className = "w-8 border-transparent",
  bg = "body-secondary",
}: SkeletonProps) => (
  <Placeholder
    bg={bg}
    className={`d-inline-block ${className} p-0`}
    style={style}
  />
);

export default Skeleton;
