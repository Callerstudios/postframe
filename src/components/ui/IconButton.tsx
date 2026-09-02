import type { ButtonHTMLAttributes } from "react";
type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
function IconButton({ className = "", ...props }: IconButtonProps) {
  return (
    <button
      className={`inline-flex size-10 items-center justify-center rounded-md text-gray-700 transition-colors duration-fast hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
export default IconButton;
