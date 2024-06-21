type IconProps = {
  name: string;
  className?: string;
  style?: React.CSSProperties;
};

const Icon = ({ name, className, style }: IconProps) => (
  <i
    suppressHydrationWarning
    className={`bi bi-${name} ${className ? className : ""}`}
    style={style}
  ></i>
);

export default Icon;
