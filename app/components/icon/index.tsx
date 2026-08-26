import type { ComponentType, HTMLAttributes } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BoxArrowRight,
  Calendar,
  CheckLg,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleFill,
  MoonStarsFill,
  PlusCircleFill,
  PlusLg,
  SunFill,
  Trash,
} from "react-bootstrap-icons";

type IconProps = HTMLAttributes<HTMLElement> & { name: string };

const icons: Record<string, ComponentType<React.SVGProps<SVGSVGElement>>> = {
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "box-arrow-right": BoxArrowRight,
  calendar: Calendar,
  "check-lg": CheckLg,
  "chevron-down": ChevronDown,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "circle-fill": CircleFill,
  "moon-stars-fill": MoonStarsFill,
  "plus-circle-fill": PlusCircleFill,
  "plus-lg": PlusLg,
  "next-month": ChevronRight,
  "previous-month": ChevronLeft,
  "sun-fill": SunFill,
  trash: Trash,
};

const Icon = ({ name, className, style, ...rest }: IconProps) => {
  const [iconName, ...classNames] = name.split(/\s+/);
  const IconComponent = icons[iconName];
  if (!IconComponent) return null;

  return (
    <i
      className={[
        "bi",
        `bi-${iconName}`,
        ...classNames,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
      {...rest}
    >
      <IconComponent aria-hidden={rest["aria-label"] ? undefined : true} />
    </i>
  );
};

export default Icon;
