type IconProps = React.HTMLAttributes<HTMLElement> & {
  name: string;
};

const Icon = ({ name, className, style, ...rest }: IconProps) => (
  <i
    suppressHydrationWarning
    className={`bi bi-${name} ${className || ""}`}
    style={style}
    {...rest}
  ></i>
);

export default Icon;
