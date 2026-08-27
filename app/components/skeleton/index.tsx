import { CSSProperties } from "react";
import { Placeholder } from "react-bootstrap";

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
    animation="glow"
    className="d-inline-block"
    style={{ lineHeight: 0, verticalAlign: "middle" }}
  >
    <Placeholder
      bg={bg}
      className={`d-inline-block ${className} p-0`}
      style={{ verticalAlign: "middle", ...style }}
    />
  </Placeholder>
);

export default Skeleton;
