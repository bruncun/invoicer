import type { CSSProperties } from "react";

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
  <span
    className="placeholder-glow d-inline-block"
    style={{ lineHeight: 0, verticalAlign: "middle" }}
  >
    <span
      className={`placeholder bg-${bg} d-inline-block ${className} p-0`}
      style={{ verticalAlign: "middle", ...style }}
    />
  </span>
);

export default Skeleton;
