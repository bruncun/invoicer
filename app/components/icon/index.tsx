type IconProps = {
  name: string;
  className?: string;
  style?: React.CSSProperties;
};

export const Icon = ({ name, className, style }: IconProps) => (
  <i
    className={`bi bi-${name} ${className ? className : ""}`}
    style={style}
  ></i>
);
