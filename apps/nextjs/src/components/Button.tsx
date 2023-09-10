import type { FunctionComponent, ReactNode } from "react";
import { MouseEventHandler } from "react";
import Link from "next/link";
import { clsx } from "clsx";

type BaseStyles = Record<string, string>;

const baseStyles: BaseStyles = {
  solid:
    "group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2",
  outline:
    "group inline-flex ring-1 items-center justify-center rounded-full py-2 px-4 text-sm focus:outline-none",
};

// type VariantStyles = Record<string, BaseStyles>;

// export interface Weather {
//   solid: Solid;
//   outline: Solid;
// }

// export interface Solid {
//   slate?: string;
//   blue?: string;
//   white?: string;
// }

type VariantStyles = Record<string, any>;

const disabledStyles: VariantStyles = {
  solid: "opacity-50 cursor-not-allowed", // Customize the styles for solid buttons
  outline: "opacity-50 cursor-not-allowed", // Customize the styles for outline buttons
};
// type VariantStylesColor = Record<string, string>;

const variantStyles: VariantStyles = {
  solid: {
    slate:
      "bg-slate-900 text-white hover:bg-slate-700 hover:text-slate-100 active:bg-slate-800 active:text-slate-300 focus-visible:outline-slate-900",
    blue: "bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600",
    white:
      "bg-white text-slate-900 hover:bg-blue-50 active:bg-blue-200 active:text-slate-600 focus-visible:outline-white",
  },
  outline: {
    slate:
      "ring-slate-200 text-slate-700 hover:text-slate-900 hover:ring-slate-300 active:bg-slate-100 active:text-slate-600 focus-visible:outline-blue-600 focus-visible:ring-slate-300",
    white:
      "ring-slate-700 text-white hover:ring-slate-500 active:ring-slate-700 active:text-slate-400 focus-visible:outline-white",
  },
};

interface ButtonProps {
  className?: string;
  href?: string | undefined;
  variant?: string;
  color?: string;
  children?: any;
  disabled: boolean;
}

const Button: FunctionComponent<ButtonProps> = ({
  variant = "solid",
  color = "slate",
  className,
  href,
  disabled = false,
  ...props
}) => {
  className = clsx(
    baseStyles[variant],
    variantStyles[variant][color],
    disabled ? disabledStyles[variant] : "",
    className,
  );
  return href ? (
    <Link href={href} className={className} {...props} />
  ) : (
    <button className={className} {...props} />
  );
};

export default Button;

// export function Button({
//   variant = "solid",
//   color = "slate",
//   className,
//   href,
//   ...props
// }) {
//   className = clsx(
//     baseStyles[variant],
//     variantStyles[variant][color],
//     className,
//   );

//   return href ? (
//     <Link href={href} className={className} {...props} />
//   ) : (
//     <button className={className} {...props} />
//   );
// }
