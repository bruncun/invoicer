import { CSSProperties } from "react";
import { Badge } from "react-bootstrap";
import useTheme from "~/hooks/use-theme";

type SkeletonProps = {
  className?: string;
  style?: CSSProperties;
  bg?: string;
};

const Skeleton = ({
  style = { height: "1.25rem" },
  className = "w-8",
  bg = "secondary",
}: SkeletonProps) => {
  const { theme } = useTheme();

  return (
    <Badge
      bg={bg ?? `bg-${theme}-secondary`}
      className={`d-inline-block ${className}`}
      style={style}
    >
      &nbsp;
    </Badge>
  );
};

export default Skeleton;
