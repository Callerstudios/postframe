import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors duration-fast focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
export default Button;
