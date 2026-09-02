import type { InputHTMLAttributes } from "react";
type InputProps = InputHTMLAttributes<HTMLInputElement>;
function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`min-h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 ${className}`}
      {...props}
    />
  );
}
export default Input;
